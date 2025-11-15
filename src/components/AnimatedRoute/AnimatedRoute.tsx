import type { FC } from 'react';
import { motion } from 'framer-motion';

interface AnimatedRouteProps {
  children: React.ReactNode;
}

const AnimatedRoute: FC<AnimatedRouteProps> = ({ children }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.25 }}
    >
      {children}
    </motion.div>
  );
};

export default AnimatedRoute;


