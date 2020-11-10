#!/usr/bin/env ruby

#script needs to be run with cmd and not in powershell.

# run a command 
def runCmd(cmd)
	puts cmd
	puts
	output = `#{cmd}`
	# was the command a success?
	unless $?.success?
		puts output
		puts	
		puts "FAILED"
		exit(false)
	end
	return output
end
		
# get the current branch
current_branch = runCmd('git branch --show-current').chomp()

# switch to the staging branch
runCmd("git checkout staging")

# pull the new staging code
runCmd("git pull")

# run the tests
runCmd("yarn lint:js")
runCmd("yarn test:ember")

# set the target in ms fashion
runCmd("setx TARGET \"staging\"")

# is the target set to staging?
val = runCmd("echo %TARGET%").chomp()

if val == "staging" 
  # what is the command for a staging deploy?
  cmd = "node_modules/.bin/ember deploy production --verbose"
  runCmd(cmd)
else
  puts "TARGET not set correctly"
end

# switch back to the "current"
runCmd("git checkout #{current_branch}")

