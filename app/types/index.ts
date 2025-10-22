export interface User {
  id: string;
  email: string;
  name: string | null;
  plan: string;
  createdAt: Date;
}

export interface Site {
  id: string;
  userId: string;
  title: string;
  theme: 'black' | 'white';
  status: 'draft' | 'published';
  createdAt: Date;
  updatedAt: Date;
}

export interface Page {
  id: string;
  siteId: string;
  slug: string;
  metaTitle: string | null;
  metaDesc: string | null;
  ogImageId: string | null;
  createdAt: Date;
  updatedAt: Date;
}

export interface Block {
  id: string;
  pageId: string;
  type: BlockType;
  order: number;
  payload: BlockPayload;
  createdAt: Date;
  updatedAt: Date;
}

export type BlockType =
  | 'text'
  | 'heading'
  | 'link'
  | 'button'
  | 'image'
  | 'logo'
  | 'background'
  | 'video'
  | 'gallery'
  | 'icon'
  | 'social-links'
  | 'contact-form'
  | 'divider'
  | 'spacer';

export interface BlockPayload {
  [key: string]: any;
}

export interface TextBlockPayload extends BlockPayload {
  content: string;
  fontSize?: number;
  color?: string;
  align?: 'left' | 'center' | 'right';
}

export interface HeadingBlockPayload extends BlockPayload {
  content: string;
  level?: 1 | 2 | 3 | 4 | 5 | 6;
  align?: 'left' | 'center' | 'right';
}

export interface LinkBlockPayload extends BlockPayload {
  url: string;
  text: string;
  newTab?: boolean;
  nofollow?: boolean;
}

export interface ButtonBlockPayload extends BlockPayload {
  url: string;
  text: string;
  variant?: 'primary' | 'secondary';
  newTab?: boolean;
}

export interface ImageBlockPayload extends BlockPayload {
  mediaId: string;
  url: string;
  alt?: string;
  width?: number;
  height?: number;
}

export interface VideoBlockPayload extends BlockPayload {
  source: 'youtube' | 'vimeo' | 'upload';
  url: string;
  mediaId?: string;
}

export interface GalleryBlockPayload extends BlockPayload {
  images: Array<{
    mediaId: string;
    url: string;
    alt?: string;
  }>;
  columns?: number;
}

export interface SocialLinksBlockPayload extends BlockPayload {
  links: Array<{
    platform: string;
    url: string;
  }>;
}

export interface ContactFormBlockPayload extends BlockPayload {
  emailTo: string;
  fields: Array<{
    type: 'text' | 'email' | 'textarea';
    label: string;
    required: boolean;
  }>;
}
