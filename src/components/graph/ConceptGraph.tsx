"use client";

import { useCallback, useMemo, useState } from "react";
import ReactFlow, {
  Node,
  Edge,
  Background,
  Controls,
  useNodesState,
  useEdgesState,
  MarkerType,
} from "reactflow";
import "reactflow/dist/style.css";
import { ConceptNode } from "@/types";

interface ConceptGraphProps {
  concepts: ConceptNode[];
}

export default function ConceptGraph({ concepts }: ConceptGraphProps) {
  const [selectedConcept, setSelectedConcept] = useState<string | null>(null);

  // Build nodes from concept data
  const initialNodes: Node[] = useMemo(
    () =>
      concepts.map((concept, index) => {
        // Calculate glow intensity based on exposure count
        const maxExposure = Math.max(
          ...concepts.map((c) => c.exposure_count)
        );
        const intensity =
          maxExposure > 0
            ? Math.max(0.3, concept.exposure_count / maxExposure)
            : 0.3;

        // Position in a force-like circular layout (fallback; ReactFlow will apply its own layout)
        const angle = (index / concepts.length) * 2 * Math.PI;
        const radius = 150 + Math.random() * 200;
        const x = 400 + radius * Math.cos(angle);
        const y = 300 + radius * Math.sin(angle);

        return {
          id: concept.id || `concept-${index}`,
          type: "default",
          position: { x, y },
          data: {
            label: concept.concept,
            exposure: concept.exposure_count,
            intensity,
          },
          style: {
            background: `rgba(88, 166, 255, ${intensity * 0.2})`,
            border: `1.5px solid rgba(88, 166, 255, ${intensity * 0.6})`,
            color: `rgba(230, 237, 243, ${0.5 + intensity * 0.5})`,
            padding: "10px 16px",
            borderRadius: "12px",
            fontSize: "13px",
            fontWeight: intensity > 0.6 ? 600 : 400,
            boxShadow: `0 0 ${intensity * 20}px rgba(88, 166, 255, ${intensity * 0.3})`,
            cursor: "pointer",
            transition: "all 0.3s ease",
          },
        };
      }),
    [concepts]
  );

  // Build edges from connected_concepts
  const initialEdges: Edge[] = useMemo(() => {
    const edges: Edge[] = [];
    const conceptMap = new Map(concepts.map((c) => [c.concept, c.id || ""]));

    concepts.forEach((concept) => {
      if (concept.connected_concepts) {
        concept.connected_concepts.forEach((connected) => {
          const sourceId = concept.id || "";
          const targetId = conceptMap.get(connected);
          if (targetId && sourceId !== targetId) {
            // Avoid duplicate edges (A→B and B→A)
            const edgeKey =
              sourceId < targetId
                ? `${sourceId}-${targetId}`
                : `${targetId}-${sourceId}`;
            if (!edges.some((e) => e.id === edgeKey)) {
              edges.push({
                id: edgeKey,
                source: sourceId < targetId ? sourceId : targetId,
                target: sourceId < targetId ? targetId : sourceId,
                style: {
                  stroke: "rgba(88, 166, 255, 0.15)",
                  strokeWidth: 1.5,
                },
                markerEnd: {
                  type: MarkerType.ArrowClosed,
                  color: "rgba(88, 166, 255, 0.3)",
                },
              });
            }
          }
        });
      }
    });

    return edges;
  }, [concepts]);

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onNodeClick = useCallback(
    (_event: React.MouseEvent, node: Node) => {
      setSelectedConcept(
        selectedConcept === node.data.label as string
          ? null
          : (node.data.label as string)
      );
    },
    [selectedConcept]
  );

  return (
    <div className="relative w-full h-full">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onNodeClick={onNodeClick}
        fitView
        minZoom={0.3}
        maxZoom={2}
      >
        <Background color="#30363d" gap={30} size={1} />
        <Controls
          style={{
            background: "#161b22",
            border: "1px solid #30363d",
            borderRadius: "8px",
          }}
        />
      </ReactFlow>

      {/* Concept detail panel */}
      {selectedConcept && (
        <div className="absolute top-4 right-4 bg-surface border border-border rounded-xl p-4 max-w-xs shadow-lg z-10">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-sm font-semibold text-accent">
              {selectedConcept}
            </h3>
            <button
              onClick={() => setSelectedConcept(null)}
              className="text-gray-500 hover:text-gray-300 text-xs"
            >
              ✕
            </button>
          </div>
          {(() => {
            const concept = concepts.find(
              (c) => c.concept === selectedConcept
            );
            if (!concept) return null;
            return (
              <div className="space-y-2 text-xs text-gray-400">
                <p>
                  <span className="text-gray-500">Exposure count:</span>{" "}
                  <span className="text-accent font-mono">
                    {concept.exposure_count}
                  </span>
                </p>
                {concept.connected_concepts.length > 0 && (
                  <div>
                    <span className="text-gray-500">Related concepts:</span>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {concept.connected_concepts.map((c) => (
                        <span
                          key={c}
                          className="px-2 py-0.5 bg-accent/10 text-accent rounded-full"
                        >
                          {c}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            );
          })()}
        </div>
      )}
    </div>
  );
}
