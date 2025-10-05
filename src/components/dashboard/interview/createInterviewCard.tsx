'use client';

import React, { useState } from 'react';
import { Plus } from 'lucide-react';
import { Card, CardContent, CardTitle } from '@/components/ui/card';
import CreateInterviewModal from '@/components/dashboard/interview/createInterviewModal';
import Modal from '@/components/dashboard/Modal';

function CreateInterviewCard() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Card
        className='flex flex-col items-center justify-center border-dashed border-2 border-border bg-card hover:border-primary transition-all duration-300 h-full rounded-xl cursor-pointer'
        onClick={() => setOpen(true)}
      >
        <CardContent className='flex flex-col items-center justify-center text-center p-6'>
          <div className='p-3 bg-muted rounded-full mb-4'>
            <Plus size={32} className='text-muted-foreground' />
          </div>
          <CardTitle className='text-md font-semibold text-foreground'>
            Create New Interview
          </CardTitle>
        </CardContent>
      </Card>
      
      {open && (
        <Modal
          open={open}
          closeOnOutsideClick={false}
          onClose={() => setOpen(false)}
        >
          <CreateInterviewModal open={open} setOpen={setOpen} />
        </Modal>
      )}
    </>
  );
}

export default CreateInterviewCard;
