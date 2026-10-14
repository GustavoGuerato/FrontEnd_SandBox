type WorkspaceSummaryProps = {
  name: string;
  memberCount: number;
}
function WorkspaceSummary({ name, memberCount }: WorkspaceSummaryProps) {
  return (
    <>
      <h2>{name}</h2>
      <p>{memberCount} membros</p>
    </>
  );
}
export default WorkspaceSummary;

