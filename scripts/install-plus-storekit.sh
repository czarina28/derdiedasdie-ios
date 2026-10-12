#!/usr/bin/env bash
set -euo pipefail
# Run AFTER npx cap sync ios and BEFORE xcodebuild.
# Requires Ruby xcodeproj gem (normally installed with CocoaPods on Bitrise).
test -f ios/App/App.xcodeproj/project.pbxproj || { echo "Missing generated Xcode project"; exit 1; }
test -f ios/App/App/ViewController.swift || { echo "Missing Capacitor ViewController.swift"; exit 1; }
cp native/PlusStoreKitPlugin.swift ios/App/App/PlusStoreKitPlugin.swift
python3 - <<'PY'
from pathlib import Path
p=Path('ios/App/App/ViewController.swift')
s=p.read_text()
if 'registerPluginInstance(PlusStoreKitPlugin())' in s:
    print('Plus plugin already registered')
elif 'class ViewController: CAPBridgeViewController' in s:
    s=s.replace('class ViewController: CAPBridgeViewController {',
                'class ViewController: CAPBridgeViewController {\n    override open func capacitorDidLoad() {\n        bridge?.registerPluginInstance(PlusStoreKitPlugin())\n    }',1)
    p.write_text(s)
else:
    raise SystemExit('Unexpected ViewController.swift: manual Capacitor plugin registration review needed')
PY
ruby - <<'RUBY'
require 'xcodeproj'
project_path='ios/App/App.xcodeproj'
project=Xcodeproj::Project.open(project_path)
target=project.targets.find { |t| t.name == 'App' }
abort 'App target not found' unless target
group=project.main_group.find_subpath('App', false)
abort 'App group not found' unless group
unless group.files.any? { |f| f.path == 'PlusStoreKitPlugin.swift' }
  file=group.new_file('PlusStoreKitPlugin.swift')
  target.source_build_phase.add_file_reference(file)
end
project.save
RUBY
echo "Native StoreKit 2 plugin installed in Xcode target"
