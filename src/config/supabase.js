import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
  "https://wxgxrkeahybeesfdvqel.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Ind4Z3hya2VhaHliZWVzZmR2cWVsIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MDY2NTQ4NTQsImV4cCI6MjAyMjIzMDg1NH0.uPpTLgU2GfYx3jR1sZroWluflusbZjfZK192cNtCmow"
);
