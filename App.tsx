
import React, { useState, useEffect, useMemo } from 'react';
import UnlockScreen from './components/UnlockScreen';
import PromptCard from './components/PromptCard';
import EditorModal from './components/EditorModal';
import { Prompt, CategoryRule } from './types';
import { Icons, DEFAULT_RULES } from './constants';

const App: React.FC = () => {
  // State
  const [isLocked, setIsLocked] = useState(true);
  const [prompts, setPrompts] = useState<Prompt[]>([]);
  const [rules, setRules] = useState<CategoryRule[]>(DEFAULT_RULES);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('全部');
  const [editingPrompt, setEditingPrompt] = useState<Prompt | undefined>(undefined);
  const [isEditorOpen, setIsEditorOpen] = useState(false);

  // Load Data
  useEffect(() => {
    const savedPrompts = localStorage.getItem('neural_prompts');
    const savedRules = localStorage.getItem('neural_rules');
    if (savedPrompts) setPrompts(JSON.parse(savedPrompts));
    if (savedRules) setRules(JSON.parse(savedRules));
  }, []);

  // Save Data
  useEffect(() => {
    localStorage.setItem('neural_prompts', JSON.stringify(prompts));
    localStorage.setItem('neural_rules', JSON.stringify(rules));
  }, [prompts, rules]);

  // Derived State
  const categories = useMemo(() => {
    const cats = new Set(prompts.map(p => p.category).filter(Boolean));
    return ['全部', ...Array.from(cats)];
  }, [prompts]);

  const filteredPrompts = useMemo(() => {
    return prompts
      .filter(p => {
        const matchesSearch = 
          p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
        
        const matchesCategory = selectedCategory === '全部' || p.category === selectedCategory;
        
        return matchesSearch && matchesCategory;
      })
      .sort((a, b) => b.createTime - a.createTime);
  }, [prompts, searchQuery, selectedCategory]);

  // Handlers
  const handleSavePrompt = (data: Partial<Prompt>) => {
    if (editingPrompt) {
      setPrompts(prev => prev.map(p => p.id === editingPrompt.id ? { ...p, ...data, updatedTime: Date.now() } as Prompt : p));
    } else {
      const newPrompt: Prompt = {
        id: Math.random().toString(36).substr(2, 9),
        title: data.title || '',
        content: data.content || '',
        category: data.category || '未分类',
        tags: data.tags || [],
        createTime: Date.now(),
        updatedTime: Date.now()
      };
      setPrompts(prev => [newPrompt, ...prev]);
    }
    setIsEditorOpen(false);
    setEditingPrompt(undefined);
  };

  const handleDelete = (id: string) => {
    if (window.confirm('确定要永久删除这条提示词吗？')) {
      setPrompts(prev => prev.filter(p => p.id !== id));
    }
  };

  const exportBackup = () => {
    const dataStr = JSON.stringify(prompts, null, 2);
    const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', `neural_backup_${new Date().toISOString().split('T')[0]}.json`);
    linkElement.click();
  };

  const handleImport = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const imported = JSON.parse(event.target?.result as string);
        if (Array.isArray(imported)) {
          setPrompts(prev => [...imported, ...prev]);
          alert('导入成功');
        }
      } catch (err) {
        alert('导入失败，请检查文件格式');
      }
    };
    reader.readAsText(file);
  };

  if (isLocked) return <UnlockScreen onUnlock={() => setIsLocked(false)} />;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Header / Search Bar Section */}
      <header className="sticky top-0 z-40 px-4 pt-6 pb-4 bg-gray-50/80 backdrop-blur-xl border-b border-gray-200">
        <div className="max-w-7xl mx-auto space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-600 rounded-xl text-white shadow-lg shadow-blue-500/30">
                <Icons.Grid />
              </div>
              <div>
                <h1 className="text-xl font-bold tracking-tight">NeuralPrompt</h1>
                <p className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">v26.2 PRO</p>
              </div>
            </div>
            <div className="flex gap-2">
              <button 
                onClick={exportBackup}
                className="p-2.5 bg-white border border-gray-200 rounded-2xl hover:bg-gray-100 transition-colors shadow-sm"
                title="导出备份"
              >
                <Icons.Cloud />
              </button>
              <label className="p-2.5 bg-white border border-gray-200 rounded-2xl hover:bg-gray-100 transition-colors shadow-sm cursor-pointer">
                <Icons.Lock />
                <input type="file" className="hidden" accept=".json" onChange={handleImport} />
              </label>
              <button 
                onClick={() => { setEditingPrompt(undefined); setIsEditorOpen(true); }}
                className="flex items-center gap-2 bg-black text-white px-5 py-2.5 rounded-2xl hover:bg-gray-800 transition-all shadow-xl shadow-black/10 active:scale-95"
              >
                <Icons.Plus />
                <span className="font-semibold text-sm">新建提示词</span>
              </button>
            </div>
          </div>

          <div className="flex flex-col md:flex-row gap-4 items-stretch md:items-center">
            <div className="relative flex-1 group">
              <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-blue-500 transition-colors">
                <Icons.Search />
              </div>
              <input 
                type="text" 
                placeholder="搜索标题、标签或内容..." 
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                className="w-full bg-white border border-gray-200 rounded-[20px] pl-11 pr-4 py-3 shadow-sm focus:outline-none focus:ring-4 focus:ring-blue-500/10 focus:border-blue-500 transition-all text-sm placeholder:text-gray-400"
              />
            </div>
            
            <div className="flex gap-1 overflow-x-auto pb-1 no-scrollbar md:pb-0 scroll-smooth">
              {categories.map(cat => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                    selectedCategory === cat 
                    ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/30' 
                    : 'bg-white text-gray-500 border border-gray-100 hover:border-gray-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 max-w-7xl mx-auto w-full p-4 md:p-6 pb-24 overflow-y-auto">
        {filteredPrompts.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-32 text-center">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mb-6">
              <Icons.Search />
            </div>
            <h3 className="text-xl font-semibold text-gray-900">未找到提示词</h3>
            <p className="text-gray-500 mt-2">尝试更改搜索词或分类，或创建一个新的</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-fadeIn">
            {filteredPrompts.map(prompt => (
              <PromptCard 
                key={prompt.id} 
                prompt={prompt} 
                onEdit={(p) => { setEditingPrompt(p); setIsEditorOpen(true); }}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </main>

      {/* Quick Stats Overlay (Floating Footer) */}
      <footer className="fixed bottom-6 left-1/2 -translate-x-1/2 z-40">
        <div className="bg-black/80 backdrop-blur-md px-6 py-3 rounded-full flex items-center gap-6 shadow-2xl border border-white/10">
          <div className="flex flex-col items-center">
            <span className="text-white/50 text-[10px] font-bold uppercase">已存储</span>
            <span className="text-white font-mono text-sm leading-none">{prompts.length}</span>
          </div>
          <div className="w-px h-6 bg-white/10" />
          <div className="flex flex-col items-center">
            <span className="text-white/50 text-[10px] font-bold uppercase">当前库</span>
            <span className="text-white font-mono text-sm leading-none">{filteredPrompts.length}</span>
          </div>
          <div className="w-px h-6 bg-white/10" />
          <div className="flex flex-col items-center cursor-pointer hover:text-blue-400 transition-colors" onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}>
            <Icons.Settings />
          </div>
        </div>
      </footer>

      {/* Modals */}
      <EditorModal 
        isOpen={isEditorOpen}
        prompt={editingPrompt}
        onClose={() => { setIsEditorOpen(false); setEditingPrompt(undefined); }}
        onSave={handleSavePrompt}
      />

      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.5s ease-out forwards;
        }
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
};

export default App;
