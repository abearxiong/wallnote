import React, { useState, useCallback } from 'react';
import { Dialog, DialogTitle, DialogContent, TextField, DialogActions, Button, Chip } from '@mui/material';
import { useShallow } from 'zustand/react/shallow';
import { getNodeData, useWallStore } from '../store/wall';
import { useReactFlow, useStore } from '@xyflow/react';
import { useUserWallStore, Wall } from '../store/user-wall';
import { message } from '@/modules/message';
// import { useNavigate } from 'react-router-dom';
import { WallData } from './CustomNode';

function FormDialog({ open, handleClose, handleSubmit, initialData }) {
  const [data, setData] = useState(initialData || { title: '', description: '', summary: '', tags: [] });

  const handleChange = (event) => {
    setData({ ...data, [event.target.name]: event.target.value });
  };

  const handleTagDelete = (tagToDelete) => {
    setData({ ...data, tags: data.tags.filter((tag) => tag !== tagToDelete) });
  };

  const handleAddTag = (event) => {
    if (event.key === 'Enter' && event.target.value !== '') {
      setData({ ...data, tags: [...data.tags, event.target.value] });
      event.target.value = ''; // Clear input after adding tag
    }
  };

  return (
    <Dialog open={open} onClose={handleClose}>
      <DialogTitle>{initialData ? 'Edit Data' : 'Create Data'}</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          margin='dense'
          name='title'
          label='Title'
          type='text'
          fullWidth
          variant='outlined'
          value={data.title}
          onChange={handleChange}
          required
        />
        <TextField
          margin='dense'
          name='description'
          label='Description'
          type='text'
          fullWidth
          multiline
          variant='outlined'
          value={data.description}
          onChange={handleChange}
        />
        <TextField
          margin='dense'
          name='summary'
          label='Summary'
          type='text'
          fullWidth
          multiline
          variant='outlined'
          value={data.summary}
          onChange={handleChange}
        />
        <TextField
          margin='dense'
          name='tags'
          label='Tags'
          type='text'
          fullWidth
          variant='outlined'
          placeholder='Press enter to add tags'
          onKeyPress={handleAddTag}
        />
        {data.tags.map((tag, index) => (
          <Chip key={index} label={tag} onDelete={() => handleTagDelete(tag)} style={{ margin: '5px' }} />
        ))}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button onClick={() => handleSubmit(data)}>Submit</Button>
      </DialogActions>
    </Dialog>
  );
}

export default FormDialog;

export const SaveModal = () => {
  const wallStore = useWallStore(useShallow((state) => state));
  const userWallStore = useUserWallStore(useShallow((state) => state));
  const { showFormDialog, setShowFormDialog, formDialogData, setFormDialogData } = wallStore;
  const reactFlowInstance = useReactFlow();
  // const navigate = useNavigate();
  const onSubmit = useCallback(
    async (values) => {
      const { id } = wallStore;
      if (!id) {
        message.error('请先保存到账号');
        return;
      }
      const nodes = reactFlowInstance.getNodes();
      const data = {
        nodes: getNodeData(nodes),
      };
      const fromData = {
        title: values.title,
        description: values.description,
        summary: values.summary,
        tags: values.tags,
        markType: 'wallnote' as 'wallnote',
        data,
      } as Wall;
      if (id) {
        fromData.id = id;
      }
      const loading = message.loading('保存中...');
      const res = await userWallStore.saveWall(fromData, { refresh: false });
      message.close(loading);
      if (res.code === 200) {
        setShowFormDialog(false);
        if (!id) {
          // 新创建
          const data = res.data;
          message.info('redirect to edit page');
          wallStore.clear();
          setTimeout(() => {
            // navigate(`/edit/${data.id}`);
          }, 2000);
        } else {
          // 编辑
          wallStore.setData(res.data);
        }
      } else {
        message.error('保存失败');
      }
    },
    [reactFlowInstance, wallStore.id],
  );
  if (!showFormDialog) {
    return null;
  }
  return <FormDialog open={showFormDialog} handleClose={() => setShowFormDialog(false)} handleSubmit={onSubmit} initialData={formDialogData} />;
};
