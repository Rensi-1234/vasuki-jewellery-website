import React from 'react';
import {motion,useReducedMotion} from 'framer-motion';
export default function Reveal({children,className='',delay=0,...props}){const reduce=useReducedMotion();return <motion.div className={className} initial={reduce?false:{opacity:0,y:22}} whileInView={{opacity:1,y:0}} viewport={{once:true,amount:.12}} transition={{duration:reduce?0:.65,delay,ease:[.22,1,.36,1]}} {...props}>{children}</motion.div>}
