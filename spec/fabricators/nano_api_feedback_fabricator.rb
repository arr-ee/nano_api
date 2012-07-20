Fabricator :nano_api_feedback, :from => 'nano_api/feedback' do
  search_id { rand(1000) + 30 }
  gate_id { rand(1000) + 30 }
  success { true }
end