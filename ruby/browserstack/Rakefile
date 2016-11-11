require "bundler/gem_tasks"
task :default => :spec
task :spec => [:cucumber]

task :cucumber do
  Bundler.with_clean_env do
    system("bundle install") 
    system("cd tests/cucumber && bundle install && bundle exec appraisal install && BSTACK_BUILD=BrowserStackPatchCucumberTest RUN_ON_BSTACK=true bundle exec appraisal cucumber")
  end
end
