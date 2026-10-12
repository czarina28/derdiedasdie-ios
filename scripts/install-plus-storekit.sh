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
  unless group.files.any? { |f| f.path == name }
    file=group.new_file(name)
    target.source_build_phase.add_file_reference(file)
  end
end
# The Capacitor storyboard must instantiate our registered bridge subclass.
storyboard='ios/App/App/Base.lproj/Main.storyboard'
if File.exist?(storyboard)
  xml=File.read(storyboard)
  xml=xml.gsub(/customClass="CAPBridgeViewController"/, 'customClass="ViewController" customModule="App" customModuleProvider="target"')
  File.write(storyboard,xml)
else
  abort 'Main.storyboard missing: cannot register native bridge safely'
end
project.save
RUBY
echo "Native StoreKit 2 plugin installed in Xcode target"
