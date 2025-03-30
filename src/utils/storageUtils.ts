
import { supabase } from "@/integrations/supabase/client";

/**
 * Uploads a file to Supabase storage
 * @param file The file to upload
 * @param bucket The bucket to upload to
 * @param path The path within the bucket
 * @returns The URL of the uploaded file
 */
export const uploadFile = async (file: File, bucket: string, path: string): Promise<string | null> => {
  try {
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(path, file, {
        upsert: true,
        cacheControl: '3600',
      });
    
    if (error) {
      console.error('Error uploading file:', error);
      return null;
    }
    
    // Get the public URL of the uploaded file
    const { data: { publicUrl } } = supabase.storage
      .from(bucket)
      .getPublicUrl(data.path);
    
    return publicUrl;
  } catch (error) {
    console.error('Error uploading file:', error);
    return null;
  }
};

/**
 * Gets the public URL of a file in Supabase storage
 * @param bucket The bucket the file is in
 * @param path The path within the bucket
 * @returns The public URL of the file
 */
export const getPublicUrl = (bucket: string, path: string): string => {
  const { data } = supabase.storage
    .from(bucket)
    .getPublicUrl(path);
  
  return data.publicUrl;
};

/**
 * Removes a file from Supabase storage
 * @param bucket The bucket the file is in
 * @param path The path within the bucket
 * @returns Boolean indicating success
 */
export const removeFile = async (bucket: string, path: string): Promise<boolean> => {
  try {
    const { error } = await supabase.storage
      .from(bucket)
      .remove([path]);
    
    if (error) {
      console.error('Error removing file:', error);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error removing file:', error);
    return false;
  }
};
