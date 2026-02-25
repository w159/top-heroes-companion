import React from 'react';
import { cn } from '../../../shared/lib/utils';
import gameGuides from '../../../data/gameGuides.json';

export const BeginnerGuide: React.FC = () => {
  return (
    <div className="space-y-4 pt-4">
      {gameGuides.beginnerGuide.steps.map((step) => (
        <div
          key={step.step}
          className={cn(
            'rounded-xl p-4 border-2',
            step.priority === 'critical'
              ? 'border-error-500/50 bg-error-500/5'
              : 'border-primary-500/30 bg-primary-500/5'
          )}
        >
          <div className="flex items-start gap-4">
            <div className={cn(
              'w-10 h-10 rounded-full flex items-center justify-center font-bold text-lg text-white flex-shrink-0',
              step.priority === 'critical' ? 'bg-error-500' : 'bg-primary-500'
            )}>
              {step.step}
            </div>
            <div className="flex-1">
              <h3 className="text-title-md font-semibold mb-2">{step.title}</h3>
              <p className="text-body-md text-muted-foreground mb-3">
                {step.description}
              </p>

              {step.rewards && (
                <div className="bg-success-500/10 border border-success-500/30 rounded-lg px-4 py-2 mb-3">
                  <span className="text-body-sm text-success-400 font-medium">
                    {'\uD83C\uDF81'} Rewards: {step.rewards}
                  </span>
                </div>
              )}

              {step.tips && (
                <ul className="space-y-1">
                  {step.tips.map((tip, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-body-sm text-muted-foreground">
                      <span className="text-primary-400">{'\u2022'}</span>
                      {tip}
                    </li>
                  ))}
                </ul>
              )}

              {step.tasks && (
                <ul className="space-y-1">
                  {step.tasks.map((task, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-body-sm text-muted-foreground">
                      <span className="text-primary-400">{'\u2022'}</span>
                      {task}
                    </li>
                  ))}
                </ul>
              )}

              {step.order && (
                <ol className="space-y-1 list-decimal list-inside">
                  {step.order.map((item, idx) => (
                    <li key={idx} className="text-body-sm text-muted-foreground">{item}</li>
                  ))}
                </ol>
              )}

              {step.priorities && (
                <ul className="space-y-1">
                  {step.priorities.map((priority, idx) => (
                    <li key={idx} className="flex items-start gap-2 text-body-sm text-muted-foreground">
                      <span className="text-gold-400">{idx + 1}.</span>
                      {priority}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
