"use client";

import { motion } from "framer-motion";

interface ConceptTagsProps {
  concepts: string[];
}

export default function ConceptTags({ concepts }: ConceptTagsProps) {
  if (concepts.length === 0) return null;

  return (
    <div className="flex items-center gap-2 flex-wrap">
      <span className="text-xs text-gray-500 font-medium">Concepts:</span>
      {concepts.map((concept, i) => (
        <motion.span
          key={concept}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: i * 0.05 }}
          className="px-2 py-0.5 text-xs font-mono bg-accent/10 text-accent border border-accent/20 rounded-full"
        >
          {concept}
        </motion.span>
      ))}
    </div>
  );
}
