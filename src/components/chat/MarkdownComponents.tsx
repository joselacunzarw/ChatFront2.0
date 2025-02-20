/**
 * @author Jose Lacunza Kobs
 * @description Markdown component customizations for the chat interface
 */

import React from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

export const markdownComponents = {
  h1: ({node, ...props}: any) => (
    <h1 className="text-2xl font-bold mb-4 text-gray-900" {...props} />
  ),
  h2: ({node, ...props}: any) => (
    <h2 className="text-xl font-bold mb-3 text-gray-900" {...props} />
  ),
  h3: ({node, ...props}: any) => (
    <h3 className="text-lg font-bold mb-2 text-gray-900" {...props} />
  ),
  
  p: ({node, ...props}: any) => (
    <p className="text-gray-800 leading-relaxed mb-4" {...props} />
  ),

  ul: ({node, ...props}: any) => (
    <ul className="list-disc pl-6 mb-4 space-y-2 text-gray-800" {...props} />
  ),

  ol: ({node, ...props}: any) => (
    <ol className="list-decimal pl-6 mb-4 space-y-2 text-gray-800" {...props} />
  ),

  li: ({node, ...props}: any) => (
    <li className="text-gray-800" {...props} />
  ),
  
  a: ({node, href, ...props}: any) => (
    <a 
      href={href}
      className="text-primary hover:text-primary-dark hover:underline transition-colors" 
      target="_blank"
      rel="noopener noreferrer"
      {...props}
    />
  ),
  
  code: ({node, inline, className, children, ...props}: any) => {
    const match = /language-(\w+)/.exec(className || '');
    return !inline && match ? (
      <div className="my-4">
        <SyntaxHighlighter
          style={vscDarkPlus}
          language={match[1]}
          PreTag="div"
          className="rounded-lg !bg-gray-900"
          {...props}
        >
          {String(children).replace(/\n$/, '')}
        </SyntaxHighlighter>
      </div>
    ) : (
      <code 
        className="px-1.5 py-0.5 rounded bg-gray-100 text-sm font-mono text-gray-800" 
        {...props}
      >
        {children}
      </code>
    );
  },
  
  table: ({node, ...props}: any) => (
    <div className="my-4 overflow-x-auto">
      <table className="min-w-full border-collapse border border-gray-200 bg-white" {...props} />
    </div>
  ),
  thead: ({node, ...props}: any) => (
    <thead className="bg-gray-50" {...props} />
  ),
  th: ({node, ...props}: any) => (
    <th className="px-4 py-2 text-left text-sm font-semibold text-gray-900 border border-gray-200" {...props} />
  ),
  td: ({node, ...props}: any) => (
    <td className="px-4 py-2 text-sm text-gray-800 border border-gray-200" {...props} />
  ),
  
  blockquote: ({node, ...props}: any) => (
    <blockquote 
      className="border-l-4 border-primary/20 pl-4 py-2 my-4 italic text-gray-700 bg-gray-50 rounded-r"
      {...props}
    />
  ),
  
  strong: ({node, ...props}: any) => (
    <strong className="font-semibold text-gray-900" {...props} />
  ),
  
  em: ({node, ...props}: any) => (
    <em className="text-gray-800 italic" {...props} />
  ),
};