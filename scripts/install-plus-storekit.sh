#!/usr/bin/env bash
set -euo pipefail
# NativePurchases is installed automatically by Capacitor sync.
# Retain this step temporarily for existing Bitrise workflow compatibility.
echo 'Using @capgo/native-purchases; custom PlusStoreKit bridge disabled.'
