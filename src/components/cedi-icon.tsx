
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
      <path d="M17 18.5a6 6 0 0 1-5 0" />
      <path d="M12 12h.01" />
      <path d="M17 5.5a6 6 0 0 0-5 0" />
      <path d="M12 2v20" />
    </svg>
  );
}

    