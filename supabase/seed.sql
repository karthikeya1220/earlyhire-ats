-- EarlyHire ATS — fictional demo data (idempotent: clears ats_* rows first).
-- 6 jobs, 30 candidates across all 7 stages, generated stage history + notes.

begin;

delete from public.ats_events;
delete from public.ats_candidates;
delete from public.ats_jobs;

insert into public.ats_jobs (id, title, department, location, employment_type, status, created_at) values
  ('00000000-0000-4000-8000-000000000001', 'Senior Frontend Engineer', 'Engineering', 'Remote', 'Full-time', 'open', now() - interval '70 days'),
  ('00000000-0000-4000-8000-000000000002', 'Backend Engineer', 'Engineering', 'Bengaluru', 'Full-time', 'open', now() - interval '65 days'),
  ('00000000-0000-4000-8000-000000000003', 'Product Designer', 'Design', 'Remote', 'Full-time', 'open', now() - interval '55 days'),
  ('00000000-0000-4000-8000-000000000004', 'Growth Marketing Manager', 'Marketing', 'Mumbai', 'Full-time', 'open', now() - interval '50 days'),
  ('00000000-0000-4000-8000-000000000005', 'Data Analyst', 'Data', 'Hyderabad', 'Contract', 'open', now() - interval '40 days'),
  ('00000000-0000-4000-8000-000000000006', 'Customer Success Manager', 'Customer', 'Chennai', 'Full-time', 'closed', now() - interval '90 days');

insert into public.ats_candidates
  (id, job_id, name, email, phone, location, current_title, current_company, experience_years, skills, resume_summary, source, stage, created_at)
values
  -- Senior Frontend Engineer
  ('00000000-0000-4000-8000-000000000101', '00000000-0000-4000-8000-000000000001', 'Aarav Mehta', 'aarav.mehta@example.com', '+91-9810010101', 'Bengaluru', 'Frontend Lead', 'Zeta Systems', 6, array['React','TypeScript','Next.js','Design Systems'], 'Led the design-system rebuild at Zeta; 40+ components shipped across 3 product lines. Comfortable owning performance budgets end-to-end.', 'Referral', 'interview', now() - interval '48 days'),
  ('00000000-0000-4000-8000-000000000102', '00000000-0000-4000-8000-000000000001', 'Priya Nair', 'priya.nair@example.com', '+91-9810010102', 'Kochi', 'Senior Software Engineer', 'Orbit Labs', 7, array['React','TypeScript','GraphQL','Testing'], 'Six years building B2B dashboards; owns the component library and visual regression suite at Orbit.', 'LinkedIn', 'offer', now() - interval '42 days'),
  ('00000000-0000-4000-8000-000000000103', '00000000-0000-4000-8000-000000000001', 'Rohan Desai', 'rohan.desai@example.com', '+91-9810010103', 'Pune', 'Software Engineer', 'Nimbus Softworks', 4, array['React','JavaScript','CSS'], 'Product engineer on a logistics SaaS; rebuilt the tracking UI with React and cut load time by 45%.', 'Careers page', 'applied', now() - interval '12 days'),
  ('00000000-0000-4000-8000-000000000104', '00000000-0000-4000-8000-000000000001', 'Kavya Iyer', 'kavya.iyer@example.com', '+91-9810010104', 'Chennai', 'Frontend Engineer', 'Pixelforge', 5, array['React','Next.js','Tailwind CSS','Accessibility'], 'Shipped the customer portal rewrite at Pixelforge; strong accessibility practices (WCAG AA audits).', 'LinkedIn', 'screening', now() - interval '28 days'),
  ('00000000-0000-4000-8000-000000000105', '00000000-0000-4000-8000-000000000001', 'Vikram Shah', 'vikram.shah@example.com', '+91-9810010105', 'Ahmedabad', 'Staff Frontend Engineer', 'Meridian Tech', 8, array['React','TypeScript','Performance','Architecture'], 'Owned the frontend platform at Meridian (micro-frontends, CI perf gates). Accepted our offer; joining next month.', 'Referral', 'joined', now() - interval '60 days'),
  ('00000000-0000-4000-8000-000000000106', '00000000-0000-4000-8000-000000000001', 'Meera Joshi', 'meera.joshi@example.com', '+91-9810010106', 'Indore', 'UI Engineer', 'Bright Apps', 3, array['HTML','CSS','JavaScript'], 'Solid visual polish but limited experience with state management and testing at scale. Not advancing.', 'Careers page', 'rejected', now() - interval '35 days'),
  -- Backend Engineer
  ('00000000-0000-4000-8000-000000000107', '00000000-0000-4000-8000-000000000002', 'Arjun Reddy', 'arjun.reddy@example.com', '+91-9810010107', 'Hyderabad', 'Backend Engineer', 'Quantify', 6, array['Go','PostgreSQL','Kafka','gRPC'], 'Scaled the order pipeline at Quantify to 12k rps; deep Postgres tuning and event-driven design.', 'Referral', 'interview', now() - interval '44 days'),
  ('00000000-0000-4000-8000-000000000108', '00000000-0000-4000-8000-000000000002', 'Sneha Kulkarni', 'sneha.kulkarni@example.com', '+91-9810010108', 'Pune', 'Software Engineer II', 'Cloudnest', 5, array['Node.js','TypeScript','Redis','AWS'], 'Built billing and subscription services at Cloudnest; strong API design fundamentals.', 'LinkedIn', 'shortlisted', now() - interval '30 days'),
  ('00000000-0000-4000-8000-000000000109', '00000000-0000-4000-8000-000000000002', 'Karan Malhotra', 'karan.malhotra@example.com', '+91-9810010109', 'New Delhi', 'Backend Developer', 'Stackline', 3, array['Java','Spring Boot','MySQL'], 'CRUD-heavy background; limited exposure to distributed systems. Phone screen pending.', 'Careers page', 'applied', now() - interval '9 days'),
  ('00000000-0000-4000-8000-000000000110', '00000000-0000-4000-8000-000000000002', 'Ananya Banerjee', 'ananya.banerjee@example.com', '+91-9810010110', 'Kolkata', 'Senior Engineer', 'Fintrail', 5, array['Python','Django','PostgreSQL','Docker'], 'Payments infrastructure at Fintrail; PCI-scoped services and audit-friendly logging.', 'LinkedIn', 'screening', now() - interval '26 days'),
  ('00000000-0000-4000-8000-000000000111', '00000000-0000-4000-8000-000000000002', 'Siddharth Rao', 'siddharth.rao@example.com', '+91-9810010111', 'Bengaluru', 'Software Engineer', 'Quickcart', 4, array['Python','Flask','AWS'], 'Could not reason clearly about transaction isolation during the system design round. Rejected after onsite.', 'Referral', 'rejected', now() - interval '38 days'),
  ('00000000-0000-4000-8000-000000000112', '00000000-0000-4000-8000-000000000002', 'Divya Menon', 'divya.menon@example.com', '+91-9810010112', 'Kochi', 'Senior Backend Engineer', 'Lumen Health', 7, array['Go','PostgreSQL','Kubernetes','Observability'], 'Led the platform team through a zero-downtime migration of the records service. Offer extended.', 'Referral', 'offer', now() - interval '50 days'),
  -- Product Designer
  ('00000000-0000-4000-8000-000000000113', '00000000-0000-4000-8000-000000000003', 'Tara Krishnan', 'tara.krishnan@example.com', '+91-9810010113', 'Chennai', 'Product Designer', 'Canvasly', 5, array['Figma','Design Systems','Prototyping','Research'], 'Owns the design system at Canvasly; pairs closely with engineering on tokens and handoff.', 'Dribbble', 'shortlisted', now() - interval '33 days'),
  ('00000000-0000-4000-8000-000000000114', '00000000-0000-4000-8000-000000000003', 'Nikhil Verma', 'nikhil.verma@example.com', '+91-9810010114', 'Jaipur', 'UI Designer', 'Studio Pixel', 3, array['Figma','Illustration','UI'], 'Strong visual craft, lighter on end-to-end product thinking. Portfolio review scheduled.', 'Careers page', 'applied', now() - interval '11 days'),
  ('00000000-0000-4000-8000-000000000115', '00000000-0000-4000-8000-000000000003', 'Ishita Sharma', 'ishita.sharma@example.com', '+91-9810010115', 'Mumbai', 'Senior Product Designer', 'Routebird', 6, array['Figma','UX','Design Systems','Workshops'], 'Redesigned Routebird’s dispatcher console; measurable drop in training time for new operators.', 'LinkedIn', 'interview', now() - interval '40 days'),
  ('00000000-0000-4000-8000-000000000116', '00000000-0000-4000-8000-000000000003', 'Aditi Bose', 'aditi.bose@example.com', '+91-9810010116', 'Kolkata', 'Product Designer', 'Hearthside', 7, array['Figma','Research','Strategy','Design Systems'], 'Joined from Hearthside; will own the recruiter-facing product surface.', 'Referral', 'joined', now() - interval '55 days'),
  -- Growth Marketing Manager
  ('00000000-0000-4000-8000-000000000117', '00000000-0000-4000-8000-000000000004', 'Rahul Kapoor', 'rahul.kapoor@example.com', '+91-9810010117', 'Mumbai', 'Growth Lead', 'SaaSly', 8, array['Growth','SEO','Lifecycle','Analytics'], 'Grew SaaSly’s self-serve funnel from 2k to 19k MQLs in 14 months. Offer extended.', 'Referral', 'offer', now() - interval '46 days'),
  ('00000000-0000-4000-8000-000000000118', '00000000-0000-4000-8000-000000000004', 'Zoya Khan', 'zoya.khan@example.com', '+91-9810010118', 'Mumbai', 'Marketing Manager', 'Bloomly', 4, array['Content','Social','Paid Media'], 'Ran paid social for a D2C brand; limited B2B SaaS exposure. Awaiting recruiter screen.', 'Careers page', 'applied', now() - interval '8 days'),
  ('00000000-0000-4000-8000-000000000119', '00000000-0000-4000-8000-000000000004', 'Farhan Sheikh', 'farhan.sheikh@example.com', '+91-9810010119', 'Nagpur', 'Growth Marketing Lead', 'Techtrail', 5, array['SEO','Content','Marketing Ops'], 'Built the content engine at Techtrail (30k organic monthly visits). Screening call booked.', 'LinkedIn', 'screening', now() - interval '24 days'),
  ('00000000-0000-4000-8000-000000000120', '00000000-0000-4000-8000-000000000004', 'Ritika Agarwal', 'ritika.agarwal@example.com', '+91-9810010120', 'Surat', 'Marketing Executive', 'Modehouse', 4, array['Social','Email'], 'No ownership of funnel metrics or experiments; rejected after hiring-manager review.', 'Careers page', 'rejected', now() - interval '31 days'),
  -- Data Analyst
  ('00000000-0000-4000-8000-000000000121', '00000000-0000-4000-8000-000000000005', 'Manish Gupta', 'manish.gupta@example.com', '+91-9810010121', 'Hyderabad', 'Data Analyst', 'Cartwave', 4, array['SQL','Python','Looker','dbt'], 'Owns the revenue dashboards at Cartwave; introduced dbt models for the growth team.', 'LinkedIn', 'interview', now() - interval '36 days'),
  ('00000000-0000-4000-8000-000000000122', '00000000-0000-4000-8000-000000000005', 'Pooja Reddy', 'pooja.reddy@example.com', '+91-9810010122', 'Hyderabad', 'Junior Analyst', 'Insightly', 3, array['SQL','Excel','Tableau'], 'Solid SQL fundamentals; building out Python and modelling skills. Screening underway.', 'Careers page', 'screening', now() - interval '22 days'),
  ('00000000-0000-4000-8000-000000000123', '00000000-0000-4000-8000-000000000005', 'Naveen Kumar', 'naveen.kumar@example.com', '+91-9810010123', 'Vijayawada', 'Business Analyst', 'Freelance', 2, array['SQL','Excel'], 'Early-career analyst moving from consulting spreadsheets to product analytics.', 'Careers page', 'applied', now() - interval '6 days'),
  ('00000000-0000-4000-8000-000000000124', '00000000-0000-4000-8000-000000000005', 'Shruti Das', 'shruti.das@example.com', '+91-9810010124', 'Bhubaneswar', 'Analytics Consultant', 'Metricly', 4, array['SQL','Python','dbt','Looker'], 'Consulting background across 6 SaaS clients; strong stakeholder communication.', 'Referral', 'shortlisted', now() - interval '27 days'),
  -- Customer Success Manager (closed role)
  ('00000000-0000-4000-8000-000000000125', '00000000-0000-4000-8000-000000000006', 'Harish Pillai', 'harish.pillai@example.com', '+91-9810010125', 'Chennai', 'Customer Success Lead', 'Supportly', 6, array['Customer Success','Onboarding','SaaS'], 'Built the onboarding playbook at Supportly; role closed after accepting.', 'Referral', 'joined', now() - interval '85 days'),
  ('00000000-0000-4000-8000-000000000126', '00000000-0000-4000-8000-000000000006', 'Lakshmi Narayanan', 'lakshmi.n@example.com', '+91-9810010126', 'Coimbatore', 'Customer Success Manager', 'Helpstack', 5, array['Customer Success','Renewals','Training'], 'Consistent 95%+ renewal rates across a 40-account portfolio.', 'LinkedIn', 'joined', now() - interval '88 days'),
  ('00000000-0000-4000-8000-000000000127', '00000000-0000-4000-8000-000000000006', 'Gaurav Mishra', 'gaurav.mishra@example.com', '+91-9810010127', 'Lucknow', 'Support Specialist', 'Ticketly', 3, array['Support','Helpdesk'], 'Support-oriented but no B2B account-management experience; rejected at panel.', 'Careers page', 'rejected', now() - interval '78 days'),
  ('00000000-0000-4000-8000-000000000128', '00000000-0000-4000-8000-000000000006', 'Neha Chawla', 'neha.chawla@example.com', '+91-9810010128', 'Chandigarh', 'Customer Success Manager', 'Orbit Labs', 4, array['Onboarding','SaaS','Escalations'], 'Applied just before the role closed; keep warm for the next CS opening.', 'Careers page', 'applied', now() - interval '5 days'),
  ('00000000-0000-4000-8000-000000000129', '00000000-0000-4000-8000-000000000006', 'Tanvi Shetty', 'tanvi.shetty@example.com', '+91-9810010129', 'Mangaluru', 'Account Manager', 'Brightpath', 3, array['Accounts','Upselling'], 'Strong relationship skills, weak technical onboarding aptitude. Rejected.', 'Referral', 'rejected', now() - interval '81 days'),
  ('00000000-0000-4000-8000-000000000130', '00000000-0000-4000-8000-000000000006', 'Abhishek Jain', 'abhishek.jain@example.com', '+91-9810010130', 'Indore', 'Customer Success Associate', 'SaaSly', 5, array['Customer Success','QBRs','Analytics'], 'Ran QBRs for a 60-account mid-market book at SaaSly; role closed mid-process.', 'LinkedIn', 'screening', now() - interval '75 days');

-- Generate realistic stage-change histories and recruiter notes.
do $$
declare
  c record;
  stages_path text[];
  step int;
  ev_time timestamptz;
begin
  for c in select id, stage, created_at from public.ats_candidates order by created_at loop
    stages_path := case c.stage
      when 'applied' then array['applied']
      when 'screening' then array['applied', 'screening']
      when 'shortlisted' then array['applied', 'screening', 'shortlisted']
      when 'interview' then array['applied', 'screening', 'shortlisted', 'interview']
      when 'offer' then array['applied', 'screening', 'shortlisted', 'interview', 'offer']
      when 'joined' then array['applied', 'screening', 'shortlisted', 'interview', 'offer', 'joined']
      when 'rejected' then
        case (abs(hashtext(c.id::text)) % 3)
          when 0 then array['applied', 'rejected']
          when 1 then array['applied', 'screening', 'rejected']
          else array['applied', 'screening', 'shortlisted', 'rejected']
        end
    end;

    ev_time := c.created_at;
    for step in 1 .. array_length(stages_path, 1) loop
      insert into public.ats_events (candidate_id, kind, from_stage, to_stage, created_at)
      values (
        c.id,
        'stage_change',
        case when step = 1 then null else stages_path[step - 1] end,
        stages_path[step],
        ev_time
      );
      ev_time := ev_time + interval '2 days' + ((step * 7) % 5) * interval '6 hours';
    end loop;
  end loop;
end;
$$;

insert into public.ats_events (candidate_id, kind, body, created_at) values
  ('00000000-0000-4000-8000-000000000101', 'note', 'Strong portfolio; walked through the Zeta design-system rebuild for 30 minutes. Panel loop scheduled with Priyanka and the design lead.', now() - interval '36 days'),
  ('00000000-0000-4000-8000-000000000101', 'note', 'System design round went well — clear on data-fetching strategy and cache invalidation. Waiting on the culture-fit slot.', now() - interval '20 days'),
  ('00000000-0000-4000-8000-000000000102', 'note', 'Top of the stack for frontend. Comp expectations within band; offer approved by hiring manager.', now() - interval '25 days'),
  ('00000000-0000-4000-8000-000000000104', 'note', 'Screening: solid React fundamentals, thoughtful about accessibility. Move to technical interview.', now() - interval '21 days'),
  ('00000000-0000-4000-8000-000000000105', 'note', 'Offer accepted 30 Jun. Joining date confirmed; hand over to people-ops for onboarding.', now() - interval '40 days'),
  ('00000000-0000-4000-8000-000000000107', 'note', 'Excellent on Postgres internals; keep for the architecture round with the platform team.', now() - interval '32 days'),
  ('00000000-0000-4000-8000-000000000112', 'note', 'Deepest infra candidate in this batch. Offer signed; start date pending notice period (6 weeks).', now() - interval '28 days'),
  ('00000000-0000-4000-8000-000000000113', 'note', 'Design exercise score 8/10. Strong systems thinking; probe research depth in the next round.', now() - interval '24 days'),
  ('00000000-0000-4000-8000-000000000117', 'note', 'Numbers check out — walk-through of the SaaSly funnel was specific and metrics-first. Extending offer.', now() - interval '30 days'),
  ('00000000-0000-4000-8000-000000000121', 'note', 'Live SQL test: 4/5 correct, strong on window functions. Schedule onsite with the analytics lead.', now() - interval '26 days'),
  ('00000000-0000-4000-8000-000000000111', 'note', 'Rejected after system design: could not explain isolation levels or deadlock handling.', now() - interval '29 days'),
  ('00000000-0000-4000-8000-000000000125', 'note', 'Role closed with Harish accepting. Revisit Abhishek and Neha for the next CS opening.', now() - interval '60 days');

commit;
