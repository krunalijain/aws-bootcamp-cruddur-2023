-- this file was manually created
INSERT INTO public.users (display_name, email, handle, cognito_user_id)
VALUES
  ('Krunali Jain','krunalijain2001@gmail.com' , 'krunalijain' ,'1091d57b-1eb1-427d-9a1d-5b699d41075a'),
  ('Skyler','jainkrunali2001@gmail.com' , 'skyler' ,'4584cbfa-b05b-47ea-8d9a-4db98d27f460'),
  ('Andrew Bayko','bayko@exampro.co' , 'bayko' ,'MOCK'),
  ('Londo Mollari','lmollari@centari.com' ,'londo' ,'MOCK');

INSERT INTO public.activities (user_uuid, message, expires_at)
VALUES
  (
    (SELECT uuid from public.users WHERE users.handle = 'krunalijain' LIMIT 1),
    'This was imported as seed data!',
    current_timestamp + interval '10 day'
  )