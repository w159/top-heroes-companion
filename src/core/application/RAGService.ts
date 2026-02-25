/**
 * Application Layer - RAG (Retrieval-Augmented Generation) Service
 * Implements lightweight semantic search using TF-IDF for browser-based RAG
 */

import {
  IRAGService,
  DocumentChunk,
  SearchResult,
  RAGQuery,
  RAGResponse,
  IStorageService,
} from '../domain/interfaces';

const INDEX_KEY = 'app_rag_index_v2';
const DOCS_KEY = 'app_rag_documents_v2';

interface SerializedIndex {
  df: Record<string, number>;
  tf: Record<string, Record<string, number>>;
  docs: DocumentChunk[];
  totalDocs: number;
}

interface TFIDFIndex {
  documentFrequency: Map<string, number>; // term -> number of docs containing term
  termFrequency: Map<string, Map<string, number>>; // docId -> term -> frequency
  documents: DocumentChunk[];
  totalDocs: number;
}

export class RAGService implements IRAGService {
  private index: TFIDFIndex | null = null;

  constructor(private storage: IStorageService) {
    this.loadIndex();
  }

  async indexContent(chunks: DocumentChunk[]): Promise<void> {
    const documentFrequency = new Map<string, number>();
    const termFrequency = new Map<string, Map<string, number>>();

    // Build TF-IDF index
    chunks.forEach(doc => {
      const terms = this.tokenize(doc.content);
      const termCounts = new Map<string, number>();

      // Count term frequency in this document
      terms.forEach(term => {
        termCounts.set(term, (termCounts.get(term) || 0) + 1);
      });

      // Update document frequency
      const uniqueTerms = Array.from(termCounts.keys());
      uniqueTerms.forEach(term => {
        documentFrequency.set(term, (documentFrequency.get(term) || 0) + 1);
      });

      termFrequency.set(doc.id, termCounts);
    });

    this.index = {
      documentFrequency,
      termFrequency,
      documents: chunks,
      totalDocs: chunks.length,
    };

    this.saveIndex();
  }

  async search(query: RAGQuery): Promise<SearchResult[]> {
    if (!this.index) {
      throw new Error('RAG index not initialized');
    }

    const queryTerms = this.tokenize(query.query);
    const scores: Map<string, number> = new Map();

    // Calculate TF-IDF score for each document
    this.index.documents.forEach(doc => {
      // Apply filters if specified
      if (query.filters) {
        if (query.filters.category && !query.filters.category.includes(doc.category)) {
          return;
        }
        if (query.filters.source && !query.filters.source.includes(doc.source)) {
          return;
        }
      }

      const docTerms = this.index!.termFrequency.get(doc.id);
      if (!docTerms) return;

      let score = 0;

      queryTerms.forEach(term => {
        const tf = docTerms.get(term) || 0;
        const df = this.index!.documentFrequency.get(term) || 0;

        if (tf > 0 && df > 0) {
          // TF-IDF formula
          const idf = Math.log(this.index!.totalDocs / df);
          score += tf * idf;
        }
      });

      // Boost exact phrase matches
      if (doc.content.toLowerCase().includes(query.query.toLowerCase())) {
        score *= 1.5;
      }

      // Boost by metadata relevance
      if (doc.metadata.priority === 'high') {
        score *= 1.3;
      }

      scores.set(doc.id, score);
    });

    // Sort by score and return top results
    const sortedResults = Array.from(scores.entries())
      .filter(([, score]) => score > 0)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([docId, score]) => {
        const doc = this.index!.documents.find(d => d.id === docId)!;
        return {
          chunk: doc,
          score,
          relevance: Math.min(score / 10, 1), // Normalize to 0-1
        };
      });

    return sortedResults;
  }

  async generateResponse(query: RAGQuery, results: SearchResult[]): Promise<RAGResponse> {
    if (results.length === 0) {
      return {
        answer: "I don't have specific information about that. Try asking about heroes, team builds, gear sets, pets, relics, or game strategies!",
        sources: [],
        confidence: 0,
      };
    }

    // Combine top results into context
    const context = results
      .slice(0, 3)
      .map(r => r.chunk.content)
      .join('\n\n');

    // Generate answer based on context
    const answer = this.synthesizeAnswer(query.query, context, results);

    return {
      answer,
      sources: results,
      confidence: results[0]?.relevance || 0,
    };
  }

  async reindex(): Promise<void> {
    // Reindex would fetch fresh content from /rag-content
    // This is a placeholder - actual implementation would read files
    const chunks = this.storage.get<DocumentChunk[]>(DOCS_KEY, []);
    await this.indexContent(chunks);
  }

  private synthesizeAnswer(query: string, context: string, results: SearchResult[]): string {
    // Template-based response generation
    const lowerQuery = query.toLowerCase();

    // Extract key information from context
    const lines = context.split('\n').filter(line => line.trim());

    // For hero queries
    if (lowerQuery.match(/\b(tidecaller|pyromancer|wanderer|monk|nun)\b/)) {
      const heroInfo = lines.filter(line =>
        line.match(/tier|role|faction|skill|recommended|best/i)
      );
      return this.formatHeroResponse(heroInfo);
    }

    // For team composition queries
    if (lowerQuery.match(/\b(team|composition|lineup|build)\b/)) {
      return this.formatTeamResponse(lines);
    }

    // For strategy queries
    if (lowerQuery.match(/\b(strategy|tactic|tip|guide|how to)\b/)) {
      return this.formatStrategyResponse(lines);
    }

    // Generic response
    return this.formatGenericResponse(lines);
  }

  private formatHeroResponse(lines: string[]): string {
    const formatted = lines.slice(0, 5).join('\n• ');
    return formatted ? `**Hero Information:**\n\n• ${formatted}` : 'Hero information found in context.';
  }

  private formatTeamResponse(lines: string[]): string {
    const formatted = lines.slice(0, 6).join('\n');
    return formatted ? `**Team Composition:**\n\n${formatted}` : 'Team composition details found.';
  }

  private formatStrategyResponse(lines: string[]): string {
    const formatted = lines.slice(0, 8).join('\n');
    return formatted ? `**Strategy Guide:**\n\n${formatted}` : 'Strategy information found.';
  }

  private formatGenericResponse(lines: string[]): string {
    return lines.slice(0, 5).join('\n');
  }

  private tokenize(text: string): string[] {
    return text
      .toLowerCase()
      .replace(/[^\w\s]/g, ' ')
      .split(/\s+/)
      .filter(word => word.length > 2 && !this.isStopWord(word));
  }

  private isStopWord(word: string): boolean {
    const stopWords = new Set([
      'the', 'is', 'at', 'which', 'on', 'a', 'an', 'and', 'or', 'but',
      'in', 'with', 'to', 'for', 'of', 'as', 'by', 'that', 'this',
    ]);
    return stopWords.has(word);
  }

  private loadIndex(): void {
    const savedIndex = this.storage.get<SerializedIndex | null>(INDEX_KEY, null);
    if (savedIndex) {
      this.index = {
        documentFrequency: new Map(Object.entries(savedIndex.df)),
        termFrequency: new Map(
          Object.entries(savedIndex.tf).map(([docId, terms]: [string, Record<string, number>]) => [
            docId,
            new Map(Object.entries(terms)),
          ])
        ),
        documents: savedIndex.docs,
        totalDocs: savedIndex.totalDocs,
      };
    }
  }

  private saveIndex(): void {
    if (!this.index) return;

    const serializable = {
      df: Object.fromEntries(this.index.documentFrequency),
      tf: Object.fromEntries(
        Array.from(this.index.termFrequency.entries()).map(([docId, terms]) => [
          docId,
          Object.fromEntries(terms),
        ])
      ),
      docs: this.index.documents,
      totalDocs: this.index.totalDocs,
    };

    this.storage.set(INDEX_KEY, serializable);
  }
}
