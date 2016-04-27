import React from 'react';

/**
 * Loader.
 *
 * @returns {XML}
 */
export function Loader() {
  return (
    <div className="loader">
      <svg className="loader__svg">
        <circle
          className="loader__circle"
          cx="50"
          cy="50"
          r="20"
          fill="none"
          strokeWidth="2" />
      </svg>
    </div>
  );
}

