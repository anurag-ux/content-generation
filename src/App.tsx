import { useState, useEffect, useRef } from 'react';
import { ContentForm } from './components/ContentForm';
import { GeneratedContent } from './components/GeneratedContent';
import { LoadingProgress } from './components/LoadingProgress';
import { generateContent } from './services/api';
import type {
  GenerateRequest,
  GenerateResponse,
  ContentType,
  ToneType,
  ImageStyleType,
  SavedArticle
} from './types/api';
import { marked } from 'marked';

const FORMAT_EXAMPLES: Record<ContentType, { description: string; examples: string[] }> = {
  'Article': {
    description: 'A well-structured, objective, and informative piece of writing covering a specific domain or theme. It typically uses an introductory hook, subheadings, and key stats or citations.',
    examples: [
      'The Future of Decentralized Finance: Growth, Opportunities, and Risks',
      'How Generative AI is Streamlining Modern Software Engineering Workflows',
      'Electric Vehicles in 2026: Overcoming Infrastructure Hurdles'
    ]
  },
  'Guide': {
    description: 'A hands-on, step-by-step tutorial or instructional manual designed to teach the audience how to perform a task or understand a process from start to finish.',
    examples: [
      'A Developer’s Step-by-Step Guide to Deploying Serverless React Applications',
      'How to Build a Clean, Scaleable Component Library Using Tailwind CSS v4',
      'Beginning Machine Learning: A Practical Playbook for Engineers'
    ]
  },
  'Opinion': {
    description: 'A subjective, thought-provoking, and persuasive narrative written from a specific point of view. It often highlights hot takes, contrarian views, or personal perspectives.',
    examples: [
      'Why the Traditional 9-to-5 Software Engineering Job is Quickly Disappearing',
      'We Are Optimizing for the Wrong Metrics in Contemporary Product Development',
      'Code Generation Tools Won’t Replace Developers—But They Will Redefine Them'
    ]
  },
  'Trend Analysis': {
    description: 'A detailed, data-driven analysis of emerging market indicators, industry dynamics, statistical updates, and forward-looking forecasts.',
    examples: [
      'State of Global EV Infrastructure and Battery Tech: Q2 2026 Analysis',
      'The Rise of Autonomous Agentic Workflows: Market Trends and Venture Activity',
      'Remote Work Patterns in 2026: Analyzing Productivity and Retention Data'
    ]
  }
};

function App() {
  // Navigation Tabs state
  const [activeTab, setActiveTab] = useState<'generator' | 'saved'>('generator');

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<GenerateResponse | null>(null);
  const [lastPayload, setLastPayload] = useState<GenerateRequest | null>(null);
  const [generationTime, setGenerationTime] = useState<number | null>(null);

  // Form selections state
  const [contentType, setContentType] = useState<ContentType>('Article');
  const [tone, setTone] = useState<ToneType>('Professional');
  const [imageStyle, setImageStyle] = useState<ImageStyleType>('Photographic');

  // Saved articles state
  const [savedArticles, setSavedArticles] = useState<SavedArticle[]>([]);
  const [selectedSavedId, setSelectedSavedId] = useState<string | null>(null);

  // Reference for auto-scrolling to generated content
  const resultRef = useRef<HTMLDivElement>(null);
  const loaderRef = useRef<HTMLDivElement>(null);

  // Load saved articles from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem('saved_articles');
      if (stored) {
        setSavedArticles(JSON.parse(stored));
      }
    } catch (e) {
      console.error('Failed to load saved content from localStorage:', e);
    }
  }, []);

  // Auto-scroll effect when result is ready
  useEffect(() => {
    if (result && resultRef.current && activeTab === 'generator') {
      const timer = setTimeout(() => {
        resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
      return () => clearTimeout(timer);
    }
  }, [result, activeTab]);

  // Auto-scroll effect when loading starts
  useEffect(() => {
    if (isLoading && loaderRef.current && activeTab === 'generator') {
      const timer = setTimeout(() => {
        loaderRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 80);
      return () => clearTimeout(timer);
    }
  }, [isLoading, activeTab]);

  const handleGenerate = async (payload: GenerateRequest) => {
    setIsLoading(true);
    setError(null);
    setResult(null);
    setLastPayload(payload);
    setGenerationTime(null);

    const startTime = performance.now();
    try {
      const response = await generateContent(payload);
      const endTime = performance.now();
      setGenerationTime(endTime - startTime);
      setResult(response);
    } catch (err: any) {
      setError(err.message || 'An unexpected error occurred while generating content.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRetry = () => {
    if (lastPayload) {
      handleGenerate(lastPayload);
    }
  };

  // Save generated article to local storage
  const handleSaveArticle = () => {
    if (!result || !lastPayload) return;

    const newArticle: SavedArticle = {
      id: crypto.randomUUID(),
      topic: lastPayload.topic,
      contentType: lastPayload.contentType,
      tone: lastPayload.tone,
      imageStyle: lastPayload.imageStyle,
      text: result.text,
      imageUrl: result.imageUrl,
      savedAt: new Date().toLocaleString(),
      generationTime: generationTime ?? undefined
    };

    const updated = [newArticle, ...savedArticles];
    setSavedArticles(updated);
    localStorage.setItem('saved_articles', JSON.stringify(updated));
  };

  // Delete saved article from local storage
  const handleDeleteArticle = (id: string) => {
    const updated = savedArticles.filter(item => item.id !== id);
    setSavedArticles(updated);
    localStorage.setItem('saved_articles', JSON.stringify(updated));
    if (selectedSavedId === id) {
      setSelectedSavedId(null);
    }
  };

  const isCurrentArticleSaved = () => {
    if (!result || !lastPayload) return false;
    return savedArticles.some(
      item => item.topic === lastPayload.topic && item.text === result.text
    );
  };

  const activeSavedArticle = savedArticles.find(item => item.id === selectedSavedId);

  // Helper component to render mock format structure
  const renderFormatPreview = () => {
    switch (contentType) {
      case 'Article':
        return (
          <div className="border border-neutral-100 rounded-xl p-4 bg-neutral-50 space-y-3.5">
            <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wide">Article Wireframe Layout</span>
            
            {/* Title block */}
            <div className="space-y-1">
              <div className="h-4 bg-neutral-300 rounded w-5/6" />
              <div className="h-3 bg-neutral-200 rounded w-1/2" />
            </div>

            {/* Random Image Placeholder */}
            <div className="aspect-video bg-neutral-100 rounded border border-neutral-200 overflow-hidden relative shadow-xs">
              <img
                src="https://picsum.photos/seed/generator-article/400/225"
                alt="Article Mock Preview"
                className="w-full h-full object-cover select-none pointer-events-none"
              />
            </div>

            {/* Paragraph lines */}
            <div className="space-y-2">
              <div className="h-2 bg-neutral-200 rounded w-full" />
              <div className="h-2 bg-neutral-200 rounded w-full" />
              <div className="h-2 bg-neutral-200 rounded w-4/5" />
            </div>

            <div className="border-t border-neutral-200 pt-2 space-y-1">
              <div className="h-3 bg-neutral-300 rounded w-1/3" />
              <div className="h-2 bg-neutral-200 rounded w-full" />
              <div className="h-2 bg-neutral-200 rounded w-5/6" />
            </div>
          </div>
        );
      case 'Guide':
        return (
          <div className="border border-neutral-100 rounded-xl p-4 bg-neutral-50 space-y-3.5">
            <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wide">Guide Wireframe Layout</span>

            {/* Title block */}
            <div className="h-4 bg-neutral-300 rounded w-3/4" />

            {/* Step 1 */}
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <span className="text-xs font-bold text-neutral-700">1.</span>
                <div className="h-3 bg-neutral-300 rounded w-1/2" />
              </div>
              <div className="h-2 bg-neutral-200 rounded w-full" />
              
              {/* Code snippet block */}
              <div className="bg-neutral-800 text-[10px] text-neutral-300 font-mono p-2.5 rounded border border-neutral-700 select-none">
                $ npm run install-deps
              </div>
            </div>

            {/* Step 2 */}
            <div className="space-y-2 border-t border-neutral-200 pt-2.5">
              <div className="flex items-center space-x-2">
                <span className="text-xs font-bold text-neutral-700">2.</span>
                <div className="h-3 bg-neutral-300 rounded w-2/5" />
              </div>
              <div className="h-2 bg-neutral-200 rounded w-full" />
              
              {/* Random Image Placeholder */}
              <div className="aspect-[21/9] bg-neutral-100 rounded border border-neutral-200 overflow-hidden relative shadow-xs">
                <img
                  src="https://picsum.photos/seed/generator-guide/400/171"
                  alt="Guide Mock Preview"
                  className="w-full h-full object-cover select-none pointer-events-none"
                />
              </div>
            </div>
          </div>
        );
      case 'Opinion':
        return (
          <div className="border border-neutral-100 rounded-xl p-4 bg-neutral-50 space-y-3.5">
            <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wide">Opinion Wireframe Layout</span>

            {/* Title block */}
            <div className="h-5 bg-neutral-300 rounded w-11/12" />

            {/* Quote block style */}
            <div className="border-l-2 border-neutral-400 pl-3 py-1 space-y-1 bg-white/40">
              <div className="h-2.5 bg-neutral-300 rounded w-full italic" />
              <div className="h-2.5 bg-neutral-300 rounded w-4/5 italic" />
            </div>

            {/* Random Image Placeholder */}
            <div className="aspect-[21/9] bg-neutral-100 rounded border border-neutral-200 overflow-hidden relative shadow-xs">
              <img
                src="https://picsum.photos/seed/generator-opinion/400/171"
                alt="Opinion Mock Preview"
                className="w-full h-full object-cover select-none pointer-events-none"
              />
            </div>

            {/* Concluding arguments */}
            <div className="space-y-2">
              <div className="h-2 bg-neutral-200 rounded w-full" />
              <div className="h-2 bg-neutral-200 rounded w-5/6" />
            </div>
          </div>
        );
      case 'Trend Analysis':
        return (
          <div className="border border-neutral-100 rounded-xl p-4 bg-neutral-50 space-y-3.5">
            <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wide">Trend Analysis Wireframe Layout</span>

            {/* Title block */}
            <div className="h-4 bg-neutral-300 rounded w-5/6" />

            {/* Executive summary paragraph */}
            <div className="h-2.5 bg-neutral-200 rounded w-full" />
            
            {/* Random Image Placeholder */}
            <div className="aspect-video bg-neutral-100 rounded border border-neutral-200 overflow-hidden relative shadow-xs">
              <img
                src="https://picsum.photos/seed/generator-trend/400/225"
                alt="Trend Analysis Mock Preview"
                className="w-full h-full object-cover select-none pointer-events-none"
              />
            </div>

            {/* Mock Table/Grid list */}
            <div className="border border-neutral-200 rounded bg-white overflow-hidden text-[9px] text-neutral-500">
              <div className="flex border-b border-neutral-150 bg-neutral-50 font-bold p-1">
                <div className="w-1/2">Metric</div>
                <div className="w-1/2">Growth Rate</div>
              </div>
              <div className="flex border-b border-neutral-100 p-1">
                <div className="w-1/2">Adoption Index</div>
                <div className="w-1/2 text-green-600">+18.4%</div>
              </div>
              <div className="flex p-1">
                <div className="w-1/2">ROI Impact</div>
                <div className="w-1/2 text-green-600">+12.1%</div>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen py-10 px-4 sm:px-6 lg:px-8 flex flex-col justify-between">
      {/* Top Main Container */}
      <main className="flex-1 flex flex-col items-center justify-start w-full max-w-6xl mx-auto space-y-8">
        
        {/* Navigation Tabs Header */}
        <div className="w-full border-b border-neutral-200 flex space-x-8 pb-px font-sans">
          <button
            onClick={() => setActiveTab('generator')}
            className={`py-3.5 text-sm font-semibold border-b-2 transition duration-150 cursor-pointer ${
              activeTab === 'generator'
                ? 'border-black text-black'
                : 'border-transparent text-neutral-450 hover:text-neutral-800'
            }`}
          >
            Generator
          </button>
          <button
            onClick={() => {
              setActiveTab('saved');
              if (savedArticles.length > 0 && !selectedSavedId) {
                setSelectedSavedId(savedArticles[0].id);
              }
            }}
            className={`py-3.5 text-sm font-semibold border-b-2 transition duration-150 cursor-pointer flex items-center space-x-2.5 ${
              activeTab === 'saved'
                ? 'border-black text-black'
                : 'border-transparent text-neutral-450 hover:text-neutral-800'
            }`}
          >
            <span>Saved Content</span>
            <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold transition duration-150 ${
              activeTab === 'saved' ? 'bg-black text-white' : 'bg-neutral-100 text-neutral-50'
            }`}>
              {savedArticles.length}
            </span>
          </button>
        </div>

        {/* Tab content panels */}
        {activeTab === 'generator' ? (
          <div className="w-full space-y-8">
            {/* Form and Preview Side-by-Side Row */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
              {/* Left Column: Generator Form */}
              <div className="lg:col-span-7 bg-white border border-neutral-200 rounded-2xl shadow-xs p-6 sm:p-8 space-y-8">
                {/* Header */}
                <div className="space-y-1.5">
                  <h1 className="text-3xl font-extrabold tracking-tight text-neutral-900 sm:text-4xl">
                    AI Content Generator
                  </h1>
                  <p className="text-sm text-neutral-500">
                    Generate AI-powered content and visual assets from a single topic.
                  </p>
                </div>

                {/* Form */}
                <ContentForm
                  onSubmit={handleGenerate}
                  isLoading={isLoading}
                  contentType={contentType}
                  setContentType={setContentType}
                  tone={tone}
                  setTone={setTone}
                  imageStyle={imageStyle}
                  setImageStyle={setImageStyle}
                />

                {/* Error Alert */}
                {error && (
                  <div className="rounded-xl bg-red-50 border border-red-200 p-4 animate-fadeIn">
                    <div className="flex items-start">
                      <div className="flex-shrink-0">
                        <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clipRule="evenodd" />
                        </svg>
                      </div>
                      <div className="ml-3 flex-1">
                        <h3 className="text-sm font-medium text-red-800">
                          Generation Failed
                        </h3>
                        <div className="mt-1 text-xs text-red-700">
                          <p>{error}</p>
                        </div>
                        <div className="mt-3">
                          <button
                            type="button"
                            onClick={handleRetry}
                            className="rounded-lg bg-red-100 px-3 py-1.5 text-xs font-semibold text-red-800 shadow-xs hover:bg-red-200 transition cursor-pointer"
                          >
                            Retry
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Right Column: Dynamic Reference Box */}
              <div className="lg:col-span-5 space-y-6">
                {/* Selected Format Examples */}
                <div className="bg-white border border-neutral-200 rounded-2xl p-6 shadow-xs space-y-4">
                  <div>
                    <span className="text-[10px] uppercase font-bold tracking-widest text-neutral-400">Selected Format</span>
                    <h3 className="text-lg font-bold text-neutral-900 mt-0.5">{contentType} Reference</h3>
                  </div>
                  
                  <p className="text-xs text-neutral-600 leading-relaxed">
                    {FORMAT_EXAMPLES[contentType].description}
                  </p>

                  {/* Wireframe Preview Box */}
                  {renderFormatPreview()}

                  <div className="space-y-3 pt-2">
                    <span className="text-xs font-semibold text-neutral-800 block border-b border-neutral-100 pb-1.5">Example Output Headlines:</span>
                    <ul className="space-y-2.5">
                      {FORMAT_EXAMPLES[contentType].examples.map((example, i) => (
                        <li key={i} className="text-xs text-neutral-700 flex items-start">
                          <span className="text-neutral-400 mr-2 font-mono select-none">0{i+1}.</span>
                          <span className="italic">"{example}"</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Loading Progress State */}
            <div ref={loaderRef} className="w-full pt-4">
              <LoadingProgress isLoading={isLoading} />
            </div>

            {/* Full Width Output Result Card (renders below form/preview row) */}
            {result && (
              <div ref={resultRef} className="w-full pt-4 animate-fadeIn">
                <GeneratedContent
                  data={result}
                  topic={lastPayload?.topic}
                  contentType={lastPayload?.contentType}
                  tone={lastPayload?.tone}
                  imageStyle={lastPayload?.imageStyle}
                  generationTime={generationTime}
                  onSave={handleSaveArticle}
                  isSaved={isCurrentArticleSaved()}
                />
              </div>
            )}
          </div>
        ) : (
          /* Saved Content Panel */
          <div className="w-full">
            {savedArticles.length === 0 ? (
              /* Empty state placeholder */
              <div className="w-full bg-white border border-neutral-200 rounded-2xl shadow-xs p-12 text-center flex flex-col items-center justify-center space-y-4 min-h-[300px]">
                <div className="p-3 bg-neutral-50 rounded-full border border-neutral-100">
                  <svg className="w-8 h-8 text-neutral-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                </div>
                <div className="space-y-1">
                  <h3 className="text-base font-semibold text-neutral-900">No Saved Content</h3>
                  <p className="text-sm text-neutral-500">
                    Generate articles and click "Save Content" to view them here.
                  </p>
                </div>
              </div>
            ) : (
              /* Master Detail Layout */
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start w-full">
                
                {/* Left Side: Article List */}
                <div className="lg:col-span-4 bg-white border border-neutral-200 rounded-2xl p-4 shadow-xs space-y-2 max-h-[600px] overflow-y-auto">
                  <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-widest px-2 block mb-3 font-mono">Saved Articles</span>
                  {savedArticles.map((article) => {
                    const isSelected = article.id === selectedSavedId;
                    return (
                      <button
                        key={article.id}
                        onClick={() => setSelectedSavedId(article.id)}
                        className={`w-full text-left p-3.5 rounded-xl border transition text-xs space-y-2.5 cursor-pointer block select-none ${
                          isSelected
                            ? 'border-black bg-neutral-50 ring-1 ring-black shadow-xs'
                            : 'border-neutral-100 hover:border-neutral-200'
                        }`}
                      >
                        <div className="flex justify-between items-center">
                          <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-neutral-100 text-neutral-700">
                            {article.contentType}
                          </span>
                          <span className="text-[9px] text-neutral-400">{article.savedAt.split(',')[0]}</span>
                        </div>
                        <h4 className="font-semibold text-neutral-900 line-clamp-2 leading-tight">
                          {article.topic}
                        </h4>
                      </button>
                    );
                  })}
                </div>

                {/* Right Side: Detail Preview Panel */}
                <div className="lg:col-span-8 bg-white border border-neutral-200 rounded-2xl p-6 sm:p-8 shadow-xs">
                  {activeSavedArticle ? (
                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start animate-fadeIn">
                      {/* Left: Article Details */}
                      <div className="lg:col-span-8 space-y-6 text-left">
                        <div className="border-b border-neutral-100 pb-4">
                          <span className="text-[9px] text-neutral-500 block">Saved: {activeSavedArticle.savedAt}</span>
                        </div>
                        
                        <h2 className="text-2xl font-extrabold tracking-tight text-neutral-900 leading-tight border-b border-neutral-50 pb-4">
                          {activeSavedArticle.topic}
                        </h2>

                        {activeSavedArticle.imageUrl && (
                          <div className="overflow-hidden rounded-xl border border-neutral-200 bg-neutral-50 shadow-xs aspect-video relative w-full">
                            <img
                              src={activeSavedArticle.imageUrl}
                              alt={activeSavedArticle.topic}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        )}

                        <div 
                          className="markdown-body text-neutral-700 leading-relaxed text-sm"
                          dangerouslySetInnerHTML={{
                            __html: activeSavedArticle.text ? (marked.parse(activeSavedArticle.text) as string) : ''
                          }}
                        />
                      </div>

                      {/* Right: Metadata sidebar */}
                      <div className="lg:col-span-4 space-y-5 lg:sticky lg:top-6">
                        {/* Delete Action Card */}
                        <div className="bg-white border border-neutral-200 rounded-xl p-4 shadow-2xs space-y-3">
                          <span className="text-[10px] uppercase font-bold tracking-widest text-neutral-400 block mb-0.5">Actions</span>
                          <button
                            onClick={() => handleDeleteArticle(activeSavedArticle.id)}
                            className="w-full flex items-center justify-center space-x-1.5 py-2 border border-red-200 hover:border-red-300 hover:bg-red-55/40 text-red-600 rounded-lg text-xs font-semibold transition cursor-pointer"
                          >
                            <svg className="w-3.5 h-3.5 text-red-650" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                            <span>Delete Article</span>
                          </button>
                        </div>

                        {/* Generation Metadata Card */}
                        <div className="bg-white border border-neutral-200 rounded-xl p-4 shadow-2xs space-y-3">
                          <div className="border-b border-neutral-100 pb-2">
                            <h4 className="text-[10px] uppercase font-bold tracking-widest text-neutral-400">Generation Summary</h4>
                          </div>
                          
                          <div className="space-y-3 text-xs text-neutral-600 font-sans">
                            {activeSavedArticle.generationTime && (
                              <div className="flex justify-between items-center">
                                <span className="flex items-center gap-1.5 text-neutral-450">
                                  <span>⚡</span> Latency
                                </span>
                                <span className="font-semibold text-neutral-900">{(activeSavedArticle.generationTime / 1000).toFixed(1)} sec</span>
                              </div>
                            )}
                            <div className="flex justify-between items-center">
                              <span className="flex items-center gap-1.5 text-neutral-450">
                                <span>📝</span> Content Type
                              </span>
                              <span className="font-semibold text-neutral-900">{activeSavedArticle.contentType}</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="flex items-center gap-1.5 text-neutral-450">
                                <span>🎯</span> Tone
                              </span>
                              <span className="font-semibold text-neutral-900">{activeSavedArticle.tone}</span>
                            </div>
                            <div className="flex justify-between items-center">
                              <span className="flex items-center gap-1.5 text-neutral-450">
                                <span>🎨</span> Style
                              </span>
                              <span className="font-semibold text-neutral-900">{activeSavedArticle.imageStyle}</span>
                            </div>
                            <div className="flex justify-between items-center border-t border-neutral-150 pt-2.5">
                              <span className="flex items-center gap-1.5 text-neutral-450">
                                <span>📊</span> Word Count
                              </span>
                              <span className="font-bold text-neutral-900">
                                {activeSavedArticle.text ? activeSavedArticle.text.trim().split(/\s+/).filter(Boolean).length : 0} words
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="text-center py-12 text-sm text-neutral-400">
                      Select an article from the list to preview.
                    </div>
                  )}
                </div>
                
              </div>
            )}
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-8 text-center text-xs text-neutral-400">
        <p>&copy; {new Date().getFullYear()} AI Content Generator. Built with Vite, React and Tailwind CSS.</p>
      </footer>
    </div>
  );
}

export default App;
