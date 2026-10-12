#!/usr/bin/env bash
set -euo pipefail
# Run AFTER npx cap sync ios and BEFORE xcodebuild.
# Requires Ruby xcodeproj gem (normally installed with CocoaPods on Bitrise).
test -f ios/App/App.xcodeproj/project.pbxproj || { echo "Missing generated Xcode project"; exit 1; }

cp native/PlusStoreKitPlugin.swift ios/App/App/PlusStoreKitPlugin.swift
python3 - <<'PY'
from pathlib import Path
p=Path('ios/App/App/ViewController.swift')
if p.exists():
    s=p.read_text()
    if 'registerPluginInstance(PlusStoreKitPlugin())' not in s:
        if 'class ViewController: CAPBridgeViewController' not in s:
            raise SystemExit('Unexpected ViewController.swift: registration needs review')
        s=s.replace('class ViewController: CAPBridgeViewController {',
                    'class ViewController: CAPBridgeViewController {\n    override open func capacitorDidLoad() {\n        bridge?.registerPluginInstance(PlusStoreKitPlugin())\n    }',1)
        p.write_text(s)
else:
    p.write_text('import UIKit\nimport Capacitor\n\nclass ViewController: CAPBridgeViewController {\n    override open func capacitorDidLoad() {\n        bridge?.registerPluginInstance(PlusStoreKitPlugin())\n    }\n}\n')
PY
ruby - <<'RUBY'
require 'xcodeproj'
project_path='ios/App/App.xcodeproj'
project=Xcodeproj::Project.open(project_path)
target=project.targets.find { |t| t.name == 'App' }
abort 'App target not found' unless target
group=project.main_group.find_subpath('App', false)
abort 'App group not found' unless group
['PlusStoreKitPlugin.swift','ViewController.swift'].each do |name|
  file=group.files.find { |f| f.path == name } || group.new_file(name)
  unless target.source_build_phase.files_references.include?(file)
    target.source_build_phase.add_file_reference(file)
  end
end
required=['PlusStoreKitPlugin.swift','ViewController.swift']
compiled=target.source_build_phase.files_references.map(&:path)
missing=required-compiled
abort "Missing Swift files from App Compile Sources: #{missing.join(', ')}" unless missing.empty?
puts "App Compile Sources verified: #{required.join(', ')}"
# Explicitly assign the custom bridge controller in the storyboard.
# Capacitor templates may omit the customClass attribute entirely.
storyboard='ios/App/App/Base.lproj/Main.storyboard'
abort 'Main.storyboard missing' unless File.exist?(storyboard)
xml=File.read(storyboard)
require 'rexml/document'
doc=REXML::Document.new(xml)
controller=REXML::XPath.first(doc, '//viewController')
abort 'No storyboard viewController found' unless controller
controller.attributes['customClass']='ViewController'
controller.attributes['customModule']='App'
controller.attributes['customModuleProvider']='target'
File.write(storyboard,doc.to_s)
puts 'Storyboard controller: ' + controller.attributes['customClass'].to_s
project.save
RUBY
echo "Native StoreKit 2 plugin installed in Xcode target"
