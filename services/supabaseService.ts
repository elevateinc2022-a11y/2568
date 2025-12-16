import { supabase } from '../supabaseClient';
import { ResearchPaper, Event, FAQ, GlobalConference } from '../types';

// --- Database Operations ---

export const getPapers = async (): Promise<ResearchPaper[]> => {
  const { data, error } = await supabase
    .from('research_papers')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching papers:', error);
    return [];
  }
  
  // Map snake_case database columns to camelCase types if necessary
  // Assuming your DB columns match the SQL provided in the instructions (title, author, abstract etc)
  return data.map((item: any) => ({
      id: item.id,
      title: item.title,
      author: item.author,
      date: item.date,
      abstract: item.abstract,
      tags: item.tags || [],
      imageUrl: item.image_url,
      pdfUrl: item.pdf_url,
      videoUrl: item.video_url
  })) as ResearchPaper[];
};

export const getEvents = async (): Promise<Event[]> => {
    const { data, error } = await supabase
      .from('events')
      .select('*')
      .order('date', { ascending: true });
  
    if (error) {
      console.error('Error fetching events:', error);
      return [];
    }
    return data as Event[];
};
  
export const getFaqs = async (): Promise<FAQ[]> => {
    const { data, error } = await supabase
        .from('faqs')
        .select('*')
        .order('created_at', { ascending: true });

    if (error) {
        console.error('Error fetching FAQs:', error);
        return [];
    }
    return data as FAQ[];
};

export const createFaq = async (faq: Partial<FAQ>): Promise<FAQ | null> => {
    const { data, error } = await supabase
        .from('faqs')
        .insert([
            {
                question: faq.question,
                answer: faq.answer,
            },
        ])
        .select()
        .single();

    if (error) {
        console.error('Error creating FAQ:', error);
        return null;
    }
    return data as FAQ;
};

export const updateFaq = async (id: string, faq: Partial<FAQ>): Promise<FAQ | null> => {
    const { data, error } = await supabase
        .from('faqs')
        .update({
            question: faq.question,
            answer: faq.answer,
        })
        .eq('id', id)
        .select()
        .single();

    if (error) {
        console.error('Error updating FAQ:', error);
        return null;
    }
    return data as FAQ;
};

export const deleteFaq = async (id: string): Promise<boolean> => {
    const { error } = await supabase
        .from('faqs')
        .delete()
        .eq('id', id);

    if (error) {
        console.error('Error deleting FAQ:', error);
        return false;
    }
    return true;
};

export const getGlobalConferences = async (): Promise<GlobalConference[]> => {
  const { data, error } = await supabase
                .from('global_conferences')
                .select('id, created_at, "Date":date, "Title":title, "Location":location, description, link')
                .order('date', { ascending: true });
        if (error) {
            console.error("Supabase error details:", error.message, error.details);
            throw error;
        }
  return (data || []).map(item => ({
    id: String(item.id), // Convert bigint ID to string
    created_at: item.created_at,
    title: item.Title,
    date: item.Date,
    location: item.Location,
    description: item.description, // Now fetched
    link: item.link, // Now fetched
  })) as GlobalConference[];
};


// --- Helper for Storage Operations ---
const extractStoragePath = (url: string | undefined): string | null => {
  if (!url) return null;
  const parts = url.split('/oerc_assests/');
  return parts.length > 1 ? parts[1] : null;
};

// --- Admin Database Operations (Papers) ---

export const updatePaper = async (
  id: string,
  paperUpdates: Partial<ResearchPaper>,
  newPdfFile?: File | null,
  newImageFile?: File | null
): Promise<ResearchPaper | null> => {
  try {
    let pdfUrl = paperUpdates.pdfUrl;
    let imageUrl = paperUpdates.imageUrl;

    // First, get the current paper to determine existing file paths
    const { data: currentPaper, error: fetchError } = await supabase
      .from('research_papers')
      .select('pdf_url, image_url')
      .eq('id', id)
      .single();

    if (fetchError) throw fetchError;


    // Handle new PDF file upload
    if (newPdfFile) {
      // Delete old PDF if it exists
      const oldPdfPath = extractStoragePath(currentPaper.pdf_url);
      if (oldPdfPath) {
        await supabase.storage.from('oerc_assests').remove([oldPdfPath]);
      }

      const pdfExt = newPdfFile.name.split('.').pop();
      const pdfName = `pdfs/${Math.random().toString(36).substring(2)}.${pdfExt}`;
      const { error: uploadError } = await supabase.storage
        .from('oerc_assests')
        .upload(pdfName, newPdfFile);
      if (uploadError) throw uploadError;
      pdfUrl = supabase.storage.from('oerc_assests').getPublicUrl(pdfName).data.publicUrl;
    }

    // Handle new Image file upload
    if (newImageFile) {
      // Delete old Image if it exists
      const oldImagePath = extractStoragePath(currentPaper.image_url);
      if (oldImagePath) {
        await supabase.storage.from('oerc_assests').remove([oldImagePath]);
      }

      const imgExt = newImageFile.name.split('.').pop();
      const imgName = `images/${Math.random().toString(36).substring(2)}.${imgExt}`;
      const { error: uploadError } = await supabase.storage
        .from('oerc_assests')
        .upload(imgName, newImageFile);
      if (uploadError) throw uploadError;
      imageUrl = supabase.storage.from('oerc_assests').getPublicUrl(imgName).data.publicUrl;
    }

    // Update metadata in the database
    const { data, error: updateError } = await supabase
      .from('research_papers')
      .update({
        title: paperUpdates.title,
        author: paperUpdates.author,
        date: paperUpdates.date ? new Date(paperUpdates.date).toISOString() : undefined,
        abstract: paperUpdates.abstract,
        tags: paperUpdates.tags,
        image_url: imageUrl,
        pdf_url: pdfUrl,
        video_url: paperUpdates.videoUrl
      })
      .eq('id', id)
      .select()
      .single();

    if (updateError) throw updateError;

    // Map snake_case database columns to camelCase types
    return {
      id: data.id,
      title: data.title,
      author: data.author,
      date: data.date,
      abstract: data.abstract,
      tags: data.tags || [],
      imageUrl: data.image_url,
      pdfUrl: data.pdf_url,
      videoUrl: data.video_url
    } as ResearchPaper;

  } catch (error) {
    console.error('Error updating paper:', error);
    return null;
  }
};

export const deletePaper = async (id: string): Promise<boolean> => {
  try {
    // First, get the paper details to retrieve file paths
    const { data: paper, error: fetchError } = await supabase
      .from('research_papers')
      .select('pdf_url, image_url')
      .eq('id', id)
      .single();

    if (fetchError) throw fetchError;

    // Delete files from storage
    const filesToDelete: string[] = [];
    const pdfPath = extractStoragePath(paper.pdf_url);
    if (pdfPath) filesToDelete.push(pdfPath);
    const imagePath = extractStoragePath(paper.image_url);
    if (imagePath) filesToDelete.push(imagePath);

    if (filesToDelete.length > 0) {
      const { error: storageError } = await supabase.storage
        .from('oerc_assests')
        .remove(filesToDelete);
      if (storageError) console.error('Error deleting files from storage:', storageError);
    }

    // Then, delete the record from the database
    const { error: dbError } = await supabase
      .from('research_papers')
      .delete()
      .eq('id', id);

    if (dbError) throw dbError;

    return true;
  } catch (error) {
    console.error('Error deleting paper:', error);
    return false;
  }
};


// --- Admin Database Operations (Events) ---

export const createEvent = async (event: Partial<Event>): Promise<Event | null> => {
  const { data, error } = await supabase
    .from('events')
    .insert([
      {
        title: event.title,
        date: event.date ? new Date(event.date).toISOString() : new Date().toISOString(),
        location: event.location,
        description: event.description,
      },
    ])
    .select()
    .single();

  if (error) {
    console.error('Error creating event:', error);
    return null;
  }
  return data as Event;
};

export const updateEvent = async (id: string, event: Partial<Event>): Promise<Event | null> => {
  const { data, error } = await supabase
    .from('events')
    .update({
      title: event.title,
      date: event.date ? new Date(event.date).toISOString() : undefined,
      location: event.location,
      description: event.description,
    })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating event:', error);
    return null;
  }
  return data as Event;
};

export const deleteEvent = async (id: string): Promise<boolean> => {
  const { error } = await supabase
    .from('events')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting event:', error);
    return false;
  }
  return true;
};

// --- Admin Database Operations (Global Events) ---

export const createGlobalConference = async (conference: Partial<GlobalConference>): Promise<GlobalConference | null> => {
  const { data, error } = await supabase
    .from('global_conferences')
    .insert([
      {
        title: conference.title,
        date: conference.date ? new Date(conference.date).toISOString() : new Date().toISOString(),
        location: conference.location,
        description: conference.description,
        link: conference.link,
      },
    ])
    .select()
    .single();

  if (error) {
    console.error('Error creating global conference:', error);
    return null;
  }
  // Map snake_case database columns to camelCase types if necessary
  return {
    id: data.id,
    created_at: data.created_at,
    title: data.title, // 'title' in DB maps to 'title' in type
    date: data.date,
    location: data.location,
    description: data.description,
    link: data.link,
  } as GlobalConference;
};

export const updateGlobalConference = async (id: string, conference: Partial<GlobalConference>): Promise<GlobalConference | null> => {
  const { data, error } = await supabase
    .from('global_conferences')
    .update({
      title: conference.title, // 'title' in type maps to 'title' in DB
      date: conference.date ? new Date(conference.date).toISOString() : undefined,
      location: conference.location,
      description: conference.description,
      link: conference.link,
    })
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error('Error updating global conference:', error);
    return null;
  }
  // Map snake_case database columns to camelCase types if necessary
  return {
    id: data.id,
    created_at: data.created_at,
    title: data.title, // 'title' in DB maps to 'title' in type
    date: data.date,
    location: data.location,
    description: data.description,
    link: data.link,
  } as GlobalConference;
};

export const deleteGlobalConference = async (id: string): Promise<boolean> => {
  const { error } = await supabase
    .from('global_conferences')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting global conference:', error);
    return false;
  }
  return true;
};

// --- Storage & Upload Operations ---

export const uploadPaperToLibrary = async (
  title: string,
  author: string,
  abstract: string,
  pdfFile: File,
  imageFile: File | null,
  tags: string[]
): Promise<ResearchPaper | null> => {
  try {
    // 1. Upload the PDF file
    const pdfExt = pdfFile.name.split('.').pop();
    const pdfName = `pdfs/${Math.random().toString(36).substring(2)}.${pdfExt}`;
    
    const { error: pdfError } = await supabase.storage
      .from('oerc_assests')
      .upload(pdfName, pdfFile);

    if (pdfError) throw pdfError;

    const { data: { publicUrl: pdfUrl } } = supabase.storage
      .from('oerc_assests')
      .getPublicUrl(pdfName);

    // 2. Upload the Image file (if provided)
    let imageUrl = `https://picsum.photos/seed/${Math.floor(Math.random() * 1000)}/800/600`; // Default
    
    if (imageFile) {
        const imgExt = imageFile.name.split('.').pop();
        const imgName = `images/${Math.random().toString(36).substring(2)}.${imgExt}`;
        
        const { error: imgError } = await supabase.storage
        .from('oerc_assests')
        .upload(imgName, imageFile);

        if (imgError) throw imgError;

        const { data: { publicUrl } } = supabase.storage
        .from('oerc_assests')
        .getPublicUrl(imgName);
        
        imageUrl = publicUrl;
    }

    // 3. Insert Record into Database
    const { data, error: insertError } = await supabase
      .from('research_papers')
      .insert([
        {
          title,
          author,
          abstract,
          date: new Date().toISOString(),
          tags: tags.length > 0 ? tags : ['Research'], 
          image_url: imageUrl,
          pdf_url: pdfUrl,
        },
      ])
      .select()
      .single();

    if (insertError) throw insertError;

    // Return mapped object
    return {
        id: data.id,
        title: data.title,
        author: data.author,
        date: data.date,
        abstract: data.abstract,
        tags: data.tags,
        imageUrl: data.image_url,
        pdfUrl: data.pdf_url
    } as ResearchPaper;

  } catch (error) {
    console.error('Error in upload process:', error);
    return null;
  }
};

// --- Auth Operations ---

export const signIn = async (email: string, password: string) => {
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });
  return { data, error };
};

export const signOut = async () => {
  const { error } = await supabase.auth.signOut();
  return { error };
};

export const getCurrentUser = async () => {
  const { data: { user } } = await supabase.auth.getUser();
  return user;
};