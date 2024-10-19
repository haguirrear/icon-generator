interface ShowProps {
  when: boolean;
  fallback?: React.ReactNode;
  children: React.ReactNode;
}

const Show: React.FC<ShowProps> = ({ when, fallback = null, children }) => {
  return <>{when ? children : fallback}</>;
};


export default Show

