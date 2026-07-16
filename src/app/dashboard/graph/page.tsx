"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { supabase } from "@/lib/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import ConceptGraph from "@/components/graph/ConceptGraph";
import { ConceptNode } from "@/types";
import Link from "next/link";

export default function GraphPage() {
  const { user, loading: authLoading } = useAuth();
  const [concepts, setConcepts] = useState<ConceptNode[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchConcepts = async () => {
      try {
        const { data, error } = await supabase
          .from("concept_graph")
          .select("*")
          .order("exposure_count", { ascending: false });

        if (error) throw error;
        setConcepts(data || []);
      } catch (error) {
        console.error("Failed to fetch concepts:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchConcepts();
  }, [user]);

  if (!authLoading && !user) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-300 mb-2">
            Sign in to view your knowledge graph
          </h2>
          <p className="text-gray-500 mb-4 text-sm">
            Explore the concepts you&apos;ve encountered during your sessions.
          </p>
          <Link
            href="/auth/login"
            className="px-4 py-2 bg-accent text-white text-sm font-medium rounded-lg hover:bg-accent/80 transition-colors"
          >
            Sign In
          </Link>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="animate-spin w-8 h-8 border-2 border-accent border-t-transparent rounded-full" />
      </div>
    );
  }

  if (concepts.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-300 mb-2">
            No concepts yet
          </h2>
          <p className="text-gray-500 mb-4 text-sm">
            Use the Explain mode to generate concept tags and build your
            knowledge graph.
          </p>
          <Link
            href="/"
            className="px-4 py-2 bg-accent text-white text-sm font-medium rounded-lg hover:bg-accent/80 transition-colors"
          >
            Start Explaining Code
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="h-[calc(100vh-80px)] flex flex-col">
      <motion.div
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-4"
      >
        <h1 className="text-2xl font-bold text-gray-100">Knowledge Graph</h1>
        <p className="text-sm text-gray-500 mt-1">
          {concepts.length} concepts explored. Brighter nodes = more exposure.
        </p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.1 }}
        className="flex-1 bg-surface border border-border rounded-xl overflow-hidden"
      >
        <ConceptGraph concepts={concepts} />
      </motion.div>
    </div>
  );
}
