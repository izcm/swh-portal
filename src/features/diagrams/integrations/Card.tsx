import { Nodes } from "./nodes/Nodes";

export function IntegrationsCard({ className }: { className?: string }) {
  return (
    <Nodes
      width="100%"
      height="100%"
      viewboxWidth={320}
      viewboxHeight={240}
      strokeWidth={1}
      shares={{ nodes: 1 / 3, connectors: 1 / 3, cube: 1 / 3 }}
      className={className}
    />
  );
}
