
import React from 'react';
import { Prompt } from '../types';
import { Icons } from '../constants';

interface Props {
  prompt: Prompt;
  onEdit: (p: Prompt) => void;
  onDelete: (id: string) => void;
}

const PromptCard: React.FC<Props> = ({ prompt, onEdit, onDelete }) => {
  const copyToClipboard = () => {
    navigator.clipboard.writeText(prompt.content);
    // Simple notification could be added here
    alert('已复制到剪贴板');
  };

  return (
    <div className="group relative bg-white rounded-[24px] p-5 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col h-full active:scale-[0.98]">
      <div className="flex justify-between items-start mb-3">
        <div className="flex-1 min-w-0">
          <h3 className="text-[17px] font-semibold text-gray-900 truncate pr-4">{prompt.title}</h3>
          <div className="flex items-center gap-2 mt-1">
            <span className="text-[11px] font-medium text-blue-600 bg-blue-50 px-2 py-0.5 rounded-full uppercase tracking-wider">
              {prompt.category}
            </span>
            <span className="text-[11px] text-gray-400">
              {new Date(prompt.createTime).toLocaleDateString()}
            </span>
          </div>
        </div>
        <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button onClick={() => onEdit(prompt)} className="p-2 hover:bg-gray-100 rounded-full text-gray-500 transition-colors">
            <Icons.Edit />
          </button>
          <button onClick={() => onDelete(prompt.id)} className="p-2 hover:bg-red-50 rounded-full text-red-500 transition-colors">
            <Icons.Trash />
          </button>
        </div>
      </div>

      <div className="flex-1 bg-gray-50 rounded-[18px] p-4 mb-4 overflow-hidden relative">
        <p className="text-[14px] text-gray-600 leading-relaxed whitespace-pre-wrap line-clamp-6">
          {prompt.content}
        </p>
        <div className="absolute bottom-2 right-2">
            <button 
                onClick={copyToClipboard}
                className="bg-white/80 backdrop-blur shadow-sm p-2 rounded-xl hover:bg-white text-gray-600 transition-all active:scale-90"
            >
                <Icons.Copy />
            </button>
        </div>
      </div>

      <div className="flex flex-wrap gap-1.5">
        {prompt.tags.map((tag, i) => (
          <span key={i} className="text-[10px] text-gray-500 bg-gray-100 px-2 py-0.5 rounded-md">
            #{tag}
          </span>
        ))}
      </div>
    </div>
  );
};

export default PromptCard;
