import React from 'react';
import { 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogActions, 
  Button, 
  IconButton,
  Typography,
  useTheme,
  useMediaQuery
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import { motion, AnimatePresence } from 'framer-motion';

const UserEditModal = ({ open, onClose, title, children }) => {
  const theme = useTheme();
  const fullScreen = useMediaQuery(theme.breakpoints.down('md'));

  return (
    <AnimatePresence>
      {open && (
        <Dialog
          fullScreen={fullScreen}
          open={open}
          onClose={onClose}
          aria-labelledby="edit-user-dialog"
          PaperComponent={motion.div}
          PaperProps={{
            initial: { y: -50, opacity: 0 },
            animate: { y: 0, opacity: 1 },
            transition: { duration: 0.2 }
          }}
        >
          <DialogTitle id="edit-user-dialog" sx={{ m: 0, p: 2, display: 'flex', alignItems: 'center', bgcolor: '#077036', color: 'white', borderTopLeftRadius: '10px', borderTopRightRadius: '10px' }}>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              {title}
            </Typography>
          </DialogTitle>
          <DialogContent dividers sx={{ bgcolor: 'white', borderBottomLeftRadius: '10px', borderBottomRightRadius: '10px' }}>
            {children}
          </DialogContent>
        </Dialog>
      )}
    </AnimatePresence>
  );
};

export default UserEditModal;
