"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.supabase = void 0;
const supabase_js_1 = require("@supabase/supabase-js");
const supabaseUrl = 'https://iyjgewigalyzimllhbyq.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Iml5amdld2lnYWx5emltbGxoYnlxIiwicm9sZSI6ImFub24iLCJpYXQiOjE2NDQzMjY2NTgsImV4cCI6MTk1OTkwMjY1OH0.K-Jc-BDVzE3ZyGp6FCH0yAHjravB2Bl5-An4c6QQ33Y';
exports.supabase = (0, supabase_js_1.createClient)(supabaseUrl, supabaseAnonKey);
