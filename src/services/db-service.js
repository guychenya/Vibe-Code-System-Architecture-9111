import supabase from '../lib/supabase.js';

// DB table names with consistent suffix
const TABLES = {
  PROJECTS: 'projects_vcs2024',
  VERSIONS: 'code_versions_vcs2024',
  REQUIREMENTS: 'requirements_vcs2024',
  CHAT: 'chat_messages_vcs2024',
  MEMBERS: 'project_members_vcs2024',
  USER_PROFILES: 'user_profiles_vcs2024',
};

const VIEWS = {
  PROJECT_DETAILS: 'vw_project_details_vcs2024',
};

// Projects
export const getProjects = async () => {
  const { data, error } = await supabase
    .from(VIEWS.PROJECT_DETAILS)
    .select('*')
    .order('last_updated', { ascending: false });
  
  if (error) throw error;
  return data;
};

export const getProject = async (id) => {
  const { data, error } = await supabase
    .from(TABLES.PROJECTS)
    .select('*')
    .eq('id', id)
    .single();
  
  if (error) throw error;
  return data;
};

export const createProject = async (projectData) => {
  const { data, error } = await supabase
    .from(TABLES.PROJECTS)
    .insert([{
      ...projectData,
      created_by: supabase.auth.user()?.id,
      last_updated: new Date().toISOString()
    }])
    .select();
  
  if (error) throw error;
  return data[0];
};

export const updateProject = async (id, updates) => {
  const { data, error } = await supabase
    .from(TABLES.PROJECTS)
    .update({
      ...updates,
      last_updated: new Date().toISOString()
    })
    .eq('id', id)
    .select();
  
  if (error) throw error;
  return data[0];
};

export const deleteProject = async (id) => {
  const { error } = await supabase
    .from(TABLES.PROJECTS)
    .delete()
    .eq('id', id);
  
  if (error) throw error;
  return true;
};

// Code Versions
export const getCodeVersions = async (projectId = null) => {
  let query = supabase
    .from(TABLES.VERSIONS)
    .select('*')
    .order('created_at', { ascending: false });
  
  if (projectId) {
    query = query.eq('project_id', projectId);
  }
  
  const { data, error } = await query;
  if (error) throw error;
  return data;
};

export const createCodeVersion = async (versionData) => {
  const { data, error } = await supabase
    .from(TABLES.VERSIONS)
    .insert([{
      ...versionData,
      created_by: supabase.auth.user()?.id
    }])
    .select();
  
  if (error) throw error;
  return data[0];
};

// Requirements
export const getRequirements = async (projectId = null) => {
  let query = supabase
    .from(TABLES.REQUIREMENTS)
    .select('*')
    .order('created_at', { ascending: false });
  
  if (projectId) {
    query = query.eq('project_id', projectId);
  }
  
  const { data, error } = await query;
  if (error) throw error;
  return data;
};

export const createRequirement = async (requirementData) => {
  const { data, error } = await supabase
    .from(TABLES.REQUIREMENTS)
    .insert([{
      ...requirementData,
      created_by: supabase.auth.user()?.id
    }])
    .select();
  
  if (error) throw error;
  return data[0];
};

export const updateRequirement = async (id, updates) => {
  const { data, error } = await supabase
    .from(TABLES.REQUIREMENTS)
    .update(updates)
    .eq('id', id)
    .select();
  
  if (error) throw error;
  return data[0];
};

// Chat Messages
export const getChatMessages = async (projectId) => {
  const { data, error } = await supabase
    .from(TABLES.CHAT)
    .select('*')
    .eq('project_id', projectId)
    .order('created_at', { ascending: true });
  
  if (error) throw error;
  return data;
};

export const sendChatMessage = async (messageData) => {
  const user = supabase.auth.user();
  
  const { data, error } = await supabase
    .from(TABLES.CHAT)
    .insert([{
      ...messageData,
      sender_id: user?.id,
      sender_name: user?.user_metadata?.full_name || user?.user_metadata?.name || 'Anonymous User',
      sender_avatar: user?.user_metadata?.avatar_url
    }])
    .select();
  
  if (error) throw error;
  return data[0];
};

// User Profiles
export const getUserProfile = async (userId) => {
  const { data, error } = await supabase
    .from(TABLES.USER_PROFILES)
    .select('*')
    .eq('id', userId)
    .single();
  
  if (error && error.code !== 'PGRST116') { // PGRST116 is "row not found" error
    throw error;
  }
  
  return data;
};

export const updateUserProfile = async (userId, updates) => {
  const { data, error } = await supabase
    .from(TABLES.USER_PROFILES)
    .update(updates)
    .eq('id', userId)
    .select();
  
  if (error) throw error;
  return data[0];
};

// Project Members
export const getProjectMembers = async (projectId) => {
  const { data, error } = await supabase
    .from(TABLES.MEMBERS)
    .select('*')
    .eq('project_id', projectId);
  
  if (error) throw error;
  return data;
};

export const addProjectMember = async (memberData) => {
  const { data, error } = await supabase
    .from(TABLES.MEMBERS)
    .insert([memberData])
    .select();
  
  if (error) throw error;
  return data[0];
};

// Subscribe to real-time changes
export const subscribeToChat = (projectId, callback) => {
  return supabase
    .channel(`chat:${projectId}`)
    .on('postgres_changes', {
      event: 'INSERT',
      schema: 'public',
      table: TABLES.CHAT,
      filter: `project_id=eq.${projectId}`
    }, payload => {
      callback(payload.new);
    })
    .subscribe();
};

export default {
  getProjects,
  getProject,
  createProject,
  updateProject,
  deleteProject,
  getCodeVersions,
  createCodeVersion,
  getRequirements,
  createRequirement,
  updateRequirement,
  getChatMessages,
  sendChatMessage,
  getUserProfile,
  updateUserProfile,
  getProjectMembers,
  addProjectMember,
  subscribeToChat,
  tables: TABLES
};