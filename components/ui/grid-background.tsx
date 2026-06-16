export function GridBackground() {
  return (
    <div className="fixed inset-0 -z-10 bg-white bg-[linear-gradient(to_right,#e8f0fe_1px,transparent_1px),linear-gradient(to_bottom,#e8f0fe_1px,transparent_1px)] bg-[size:6rem_4rem]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_700px_at_100%_180px,#bfdbfe,transparent)]" />
      <div className="absolute inset-0 bg-[radial-gradient(circle_600px_at_0%_100%,#d1fae5,transparent)]" />
    </div>
  );
}
