export function GridBackground() {
  return (
    <div className="absolute inset-0 -z-10 h-full w-full bg-white bg-[linear-gradient(to_right,#e8f0fe_1px,transparent_1px),linear-gradient(to_bottom,#e8f0fe_1px,transparent_1px)] bg-[size:6rem_4rem]">
      {/* Blue glow — top right */}
      <div className="absolute bottom-0 left-0 right-0 top-0 bg-[radial-gradient(circle_700px_at_100%_180px,#bfdbfe,transparent)]" />
      {/* Green glow — bottom left */}
      <div className="absolute bottom-0 left-0 right-0 top-0 bg-[radial-gradient(circle_500px_at_0%_90%,#d1fae5,transparent)]" />
    </div>
  );
}
