
import React, { useState, useEffect } from 'react';
import { Prompt } from '../types';

interface Props {
  prompt?: Prompt;
  isOpen: boolean;
  onClose: () => void;
  onSave: (p: Partial<Prompt>) => void;
}

const EditorModal: React.FC<Props> = ({ prompt, isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState<Partial<Prompt>>({
    title: '',
    category: '',
    content: '',
    tags: []
  });
  const [tagInput, setTagInput] = useState('');

  useEffect(() => {
    if (prompt) {
      setFormData(prompt);
      setTagInput(prompt.tags.join(', '));
    } else {
      setFormData({ title: '', category: '', content: '', tags: [] });
      setTagInput('');
    }
  }, [prompt, isOpen]);

  if (!isOpen) return null;

  const handleSave = () => {
    if (!formData.title || !formData.content) return alert('请填写标题和内容');
    const tags = tagInput.split(/[,，\s]+/).filter(Boolean);
    onSave({ ...formData, tags });
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/40 backdrop-blur-sm transition-opacity">
      <div 
        className="w-full max-w-2xl bg-white rounded-t-[32px] sm:rounded-[32px] shadow-2xl overflow-hidden flex flex-col h-[90vh] sm:h-auto sm:max-h-[85vh] transition-all transform animate-slideUp"
      >
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <button onClick={onClose} className="text-blue-600 font-medium">取消</button>
          <h2 className="text-lg font-semibold">{prompt ? '编辑提示词' : '新建提示词'}</h2>
          <button onClick={handleSave} className="text-blue-600 font-bold">存储</button>
        </div>

        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-400 uppercase ml-1">标题</label>
            <input 
              type="text" 
              value={formData.title}
              onChange={e => setFormData({...formData, title: e.target.value})}
              placeholder="例如：周报润色机器人" 
              className="w-full text-xl font-semibold bg-gray-50 border-none rounded-2xl px-5 py-4 focus:ring-2 focus:ring-blue-500/20 outline-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase ml-1">分类</label>
              <input 
                type="text" 
                value={formData.category}
                onChange={e => setFormData({...formData, category: e.target.value})}
                placeholder="办公, 编程..." 
                className="w-full bg-gray-50 border-none rounded-2xl px-5 py-3 focus:ring-2 focus:ring-blue-500/20 outline-none"
              />
            </div>
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-400 uppercase ml-1">标签 (逗号分隔)</label>
              <input 
                type="text" 
                value={tagInput}
                onChange={e => setTagInput(e.target.value)}
                placeholder="效率, 写作..." 
                className="w-full bg-gray-50 border-none rounded-2xl px-5 py-3 focus:ring-2 focus:ring-blue-500/20 outline-none"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-gray-400 uppercase ml-1">提示词内容</label>
            <textarea 
              rows={12}
              value={formData.content}
              onChange={e => setFormData({...formData, content: e.target.value})}
              placeholder="在这里输入详细的提示词内容..." 
              className="w-full bg-gray-50 border-none rounded-3xl px-6 py-5 focus:ring-2 focus:ring-blue-500/20 outline-none resize-none font-mono text-[14px]"
            />
          </div>
        </div>
      </div>
      
      <style jsx>{`
        @keyframes slideUp {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }
        .animate-slideUp {
          animation: slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1);
        }
      `}</style>
    </div>
  );
};

export default EditorModal;
