
import { SVGProps } from 'react';

export function Cedi(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2Z" />
      <path d="M15.5 15.5c-1.5 1.5-3.5 2.5-5.5 2.5s-4-1-5.5-2.5" />
      <path d="M15.5 8.5c-1.5-1.5-3.5-2.5-5.5-2.5s-4 1-5.5 2.5" />
      <path d="M12 2v20" />
    </svg>
  );
}
