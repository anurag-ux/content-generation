import React, { useState } from 'react';
import type {
  ContentType,
  ToneType,
  ImageStyleType,
  GenerateRequest
} from '../types/api';
import { LoadingSpinner } from './LoadingSpinner';

interface ContentFormProps {
  onSubmit: (data: GenerateRequest) => void;
  isLoading: boolean;
  contentType: ContentType;
  setContentType: (type: ContentType) => void;
  tone: ToneType;
  setTone: (tone: ToneType) => void;
  imageStyle: ImageStyleType;
  setImageStyle: (style: ImageStyleType) => void;
}

const TONE_DESCRIPTIONS: Record<ToneType, string> = {
  Professional: 'Objective, authoritative, and formal corporate communication.',
  Casual: 'Conversational, friendly, accessible, and approachable.',
  Inspirational: 'Motivating, forward-looking, energetic, and thought-provoking.'
};

const IMAGE_STYLE_DESCRIPTIONS: Record<ImageStyleType, string> = {
  Photographic: 'Realistic captures, natural textures, and professional lighting.',
  Minimalist: 'Simple geometric shapes, clean vectors, and flat design colors.',
  '3D Render': 'CGI elements, digital depth, and modern tech aesthetics.'
};

export const ContentForm: React.FC<ContentFormProps> = ({
  onSubmit,
  isLoading,
  contentType,
  setContentType,
  tone,
  setTone,
  imageStyle,
  setImageStyle
}) => {
  const [topic, setTopic] = useState('');
  const [errors, setErrors] = useState<{ topic?: string }>({});

  const validate = (): boolean => {
    const newErrors: { topic?: string } = {};
    if (!topic.trim()) {
      newErrors.topic = 'Topic is required';
    } else if (topic.trim().length < 3) {
      newErrors.topic = 'Topic must be at least 3 characters';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validate() && !isLoading) {
      onSubmit({
        topic: topic.trim(),
        contentType,
        tone,
        imageStyle
      });
    }
  };

  const contentTypes: ContentType[] = ['Article', 'Guide', 'Opinion', 'Trend Analysis'];
  const tones: ToneType[] = ['Professional', 'Casual', 'Inspirational'];
  const imageStyles: ImageStyleType[] = ['Photographic', 'Minimalist', '3D Render'];

  return (
    <form onSubmit={handleSubmit} className="space-y-6 text-left">
      {/* Topic */}
      <div className="space-y-1.5">
        <label htmlFor="topic" className="block text-xs font-semibold text-neutral-500 uppercase tracking-wider">
          Topic <span className="text-red-500">*</span>
        </label>
        <textarea
          id="topic"
          rows={2}
          value={topic}
          onChange={(e) => {
            setTopic(e.target.value);
            if (errors.topic) setErrors({});
          }}
          placeholder="e.g. AI in Healthcare, Electric Vehicles, Future of Education"
          className={`w-full px-3.5 py-3 rounded-xl border bg-neutral-50/50 text-neutral-900 placeholder-neutral-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent transition duration-150 ease-in-out text-sm shadow-xs ${
            errors.topic ? 'border-red-500 focus:ring-red-500' : 'border-neutral-200'
          }`}
          disabled={isLoading}
        />
        {errors.topic && (
          <p id="topic-error" className="mt-1 text-xs text-red-600 font-medium">
            {errors.topic}
          </p>
        )}
      </div>

      {/* Content Type */}
      <div className="space-y-2">
        <span className="block text-xs font-semibold text-neutral-500 uppercase tracking-wider">
          Content Type
        </span>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
          {contentTypes.map((type) => {
            const isSelected = contentType === type;
            return (
              <label
                key={type}
                className={`relative flex items-center justify-center p-3.5 rounded-xl border text-xs font-semibold transition cursor-pointer select-none shadow-xs ${
                  isSelected
                    ? 'border-black bg-neutral-950 text-white shadow-md'
                    : 'border-neutral-200 hover:border-neutral-300 bg-white text-neutral-600'
                } ${isLoading ? 'opacity-60 cursor-not-allowed' : ''}`}
              >
                <input
                  type="radio"
                  name="contentType"
                  value={type}
                  checked={isSelected}
                  onChange={() => !isLoading && setContentType(type)}
                  className="sr-only"
                  disabled={isLoading}
                />
                <span>{type}</span>
              </label>
            );
          })}
        </div>
      </div>

      {/* Tone */}
      <div className="space-y-2">
        <span className="block text-xs font-semibold text-neutral-500 uppercase tracking-wider">
          Tone
        </span>
        <div className="grid grid-cols-3 gap-2">
          {tones.map((t) => {
            const isSelected = tone === t;
            return (
              <label
                key={t}
                className={`relative flex items-center justify-center p-3.5 rounded-xl border text-xs font-semibold transition cursor-pointer select-none shadow-xs ${
                  isSelected
                    ? 'border-black bg-neutral-950 text-white shadow-md'
                    : 'border-neutral-200 hover:border-neutral-300 bg-white text-neutral-600'
                } ${isLoading ? 'opacity-60 cursor-not-allowed' : ''}`}
              >
                <input
                  type="radio"
                  name="tone"
                  value={t}
                  checked={isSelected}
                  onChange={() => !isLoading && setTone(t)}
                  className="sr-only"
                  disabled={isLoading}
                />
                <span>{t}</span>
              </label>
            );
          })}
        </div>
        <p className="text-[11px] text-neutral-400 italic">
          {TONE_DESCRIPTIONS[tone]}
        </p>
      </div>

      {/* Image Style */}
      <div className="space-y-2">
        <span className="block text-xs font-semibold text-neutral-500 uppercase tracking-wider">
          Image Style
        </span>
        <div className="grid grid-cols-3 gap-2">
          {imageStyles.map((style) => {
            const isSelected = imageStyle === style;
            return (
              <label
                key={style}
                className={`relative flex items-center justify-center p-3.5 rounded-xl border text-xs font-semibold transition cursor-pointer select-none shadow-xs ${
                  isSelected
                    ? 'border-black bg-neutral-950 text-white shadow-md'
                    : 'border-neutral-200 hover:border-neutral-300 bg-white text-neutral-600'
                } ${isLoading ? 'opacity-60 cursor-not-allowed' : ''}`}
              >
                <input
                  type="radio"
                  name="imageStyle"
                  value={style}
                  checked={isSelected}
                  onChange={() => !isLoading && setImageStyle(style)}
                  className="sr-only"
                  disabled={isLoading}
                />
                <span>{style}</span>
              </label>
            );
          })}
        </div>
        <p className="text-[11px] text-neutral-400 italic">
          {IMAGE_STYLE_DESCRIPTIONS[imageStyle]}
        </p>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isLoading}
        className="w-full flex items-center justify-center py-3.5 px-4 border border-transparent rounded-xl shadow-sm text-sm font-semibold text-white bg-black hover:bg-neutral-900 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black disabled:opacity-50 disabled:cursor-not-allowed transition duration-150 ease-in-out cursor-pointer"
      >
        {isLoading ? (
          <>
            <LoadingSpinner />
            <span className="ml-2">Generating...</span>
          </>
        ) : (
          'Generate Content'
        )}
      </button>
    </form>
  );
};
