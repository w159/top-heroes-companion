// shadcn/ui component library — Arcane Forge theme
// Import from this file for consistent component usage

// Core components
export { Button, buttonVariants, type ButtonProps } from './button';
export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent, cardVariants, type CardProps } from './card';
export { Badge, badgeVariants, type BadgeProps } from './badge';
export { Input, type InputProps } from './input';
export { Textarea } from './textarea';
export { Label } from './label';
export { Separator } from './separator';
export { Chip, chipVariants, type ChipProps } from './chip';
export { IconButton, iconButtonVariants, type IconButtonProps } from './icon-button';

// Feedback components
export { Progress } from './progress';
export { Skeleton } from './skeleton';
export { Toaster } from './sonner';
export { Alert, AlertTitle, AlertDescription } from './alert';
export { ErrorBoundary } from './error-boundary';
export {
  OperationProgressModal,
  type OperationProgressModalProps, type OperationStep, type StepStatus,
} from './operation-progress-modal';

// Overlay components
export {
  Dialog, DialogPortal, DialogOverlay, DialogClose, DialogTrigger,
  DialogContent, DialogHeader, DialogFooter, DialogTitle, DialogDescription,
} from './dialog';
export {
  AlertDialog, AlertDialogPortal, AlertDialogOverlay, AlertDialogTrigger,
  AlertDialogContent, AlertDialogHeader, AlertDialogFooter, AlertDialogTitle,
  AlertDialogDescription, AlertDialogAction, AlertDialogCancel,
} from './alert-dialog';
export {
  Sheet, SheetPortal, SheetOverlay, SheetTrigger, SheetClose,
  SheetContent, SheetHeader, SheetFooter, SheetTitle, SheetDescription,
} from './sheet';
export { Popover, PopoverTrigger, PopoverContent } from './popover';
export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider } from './tooltip';
export {
  DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem,
  DropdownMenuCheckboxItem, DropdownMenuRadioItem, DropdownMenuLabel,
  DropdownMenuSeparator, DropdownMenuShortcut, DropdownMenuGroup,
  DropdownMenuPortal, DropdownMenuSub, DropdownMenuSubContent,
  DropdownMenuSubTrigger, DropdownMenuRadioGroup,
} from './dropdown-menu';

// Navigation & layout
export { Tabs, TabsList, TabsTrigger, TabsContent } from './tabs';
export { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from './accordion';
export { Collapsible, CollapsibleTrigger, CollapsibleContent } from './collapsible';
export { ScrollArea, ScrollBar } from './scroll-area';

// Form components
export {
  Select, SelectGroup, SelectValue, SelectTrigger, SelectContent,
  SelectLabel, SelectItem, SelectSeparator,
} from './select';
export { Switch } from './switch';
export { Checkbox } from './checkbox';
export { Toggle, toggleVariants } from './toggle';
export { ToggleGroup, ToggleGroupItem } from './toggle-group';
export {
  useFormField, Form, FormItem, FormLabel, FormControl,
  FormDescription, FormMessage, FormField,
} from './form';

// Re-export utility function
export { cn } from '@/shared/lib/utils';
