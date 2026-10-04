import * as React from 'react';
export interface CharacterCountProps extends React.HTMLAttributes<HTMLParagraphElement> {
  currentSize: number;
  maxSize: number;
  minSize?: number;
}
export declare function CharacterCount({
  currentSize,
  maxSize,
  minSize,
  className,
  ...props
}: CharacterCountProps): import('react/jsx-runtime').JSX.Element;
