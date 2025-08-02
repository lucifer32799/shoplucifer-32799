-- Create website settings table for admin configurations
CREATE TABLE public.website_settings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  redirect_url TEXT,
  site_title TEXT DEFAULT 'My Website',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.website_settings ENABLE ROW LEVEL SECURITY;

-- Create policies for website settings
CREATE POLICY "Anyone can view website settings" 
ON public.website_settings 
FOR SELECT 
USING (true);

CREATE POLICY "Authenticated users can update website settings" 
ON public.website_settings 
FOR UPDATE 
USING (true);

CREATE POLICY "Authenticated users can insert website settings" 
ON public.website_settings 
FOR INSERT 
WITH CHECK (true);

-- Create products table
CREATE TABLE public.products (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  category TEXT NOT NULL,
  images TEXT[] DEFAULT '{}',
  purchase_link TEXT,
  shop_link TEXT,
  is_featured BOOLEAN DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;

-- Create policies for products
CREATE POLICY "Anyone can view products" 
ON public.products 
FOR SELECT 
USING (true);

CREATE POLICY "Authenticated users can insert products" 
ON public.products 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Authenticated users can update products" 
ON public.products 
FOR UPDATE 
USING (true);

CREATE POLICY "Authenticated users can delete products" 
ON public.products 
FOR DELETE 
USING (true);

-- Create content table for editable content
CREATE TABLE public.content (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  key TEXT NOT NULL UNIQUE,
  value TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.content ENABLE ROW LEVEL SECURITY;

-- Create policies for content
CREATE POLICY "Anyone can view content" 
ON public.content 
FOR SELECT 
USING (true);

CREATE POLICY "Authenticated users can insert content" 
ON public.content 
FOR INSERT 
WITH CHECK (true);

CREATE POLICY "Authenticated users can update content" 
ON public.content 
FOR UPDATE 
USING (true);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_website_settings_updated_at
  BEFORE UPDATE ON public.website_settings
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_products_updated_at
  BEFORE UPDATE ON public.products
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_content_updated_at
  BEFORE UPDATE ON public.content
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Insert default website settings
INSERT INTO public.website_settings (redirect_url, site_title) 
VALUES (null, 'My Website');

-- Insert default content
INSERT INTO public.content (key, value) VALUES
('hero_title', 'Chào mừng đến với website của chúng tôi'),
('hero_subtitle', 'Khám phá những sản phẩm tuyệt vời'),
('hero_button', 'Khám phá ngay'),
('about_title', 'Về chúng tôi'),
('about_description', 'Chúng tôi là một công ty chuyên cung cấp những sản phẩm chất lượng cao'),
('products_title', 'Sản phẩm nổi bật'),
('featured_products_title', 'Cửa hàng nổi bật'),
('footer_text', '© 2024 My Website. Tất cả quyền được bảo lưu.');