-- Create function to delete user and all associated data
CREATE OR REPLACE FUNCTION delete_user()
RETURNS void
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    user_uuid uuid;
BEGIN
    -- Get the current user's UUID
    user_uuid := auth.uid();
    
    IF user_uuid IS NULL THEN
        RAISE EXCEPTION 'Not authenticated';
    END IF;
    
    -- Delete user's notes (this will cascade to note_tags due to foreign key)
    DELETE FROM notes WHERE user_id = user_uuid;
    
    -- Delete user's tags
    DELETE FROM tags WHERE user_id = user_uuid;
    
    -- Delete the user from auth.users (this requires SECURITY DEFINER)
    DELETE FROM auth.users WHERE id = user_uuid;
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION delete_user() TO authenticated;
