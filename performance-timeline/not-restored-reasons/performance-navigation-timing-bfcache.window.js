// META: title=RemoteContextHelper navigation using BFCache
// META: script=./test-helper.js
// META: script=/common/dispatcher/dispatcher.js
// META: script=/common/get-host-info.sub.js
// META: script=/common/utils.js
// META: script=/html/browsers/browsing-the-web/remote-context-helper/resources/remote-context-helper.js

'use strict';

// Ensure that notRestoredReasons is empty for successful BFCache restore.
promise_test(async t => {
  const rcHelper = new RemoteContextHelper();

  // Open a window with noopener so that BFCache will work.
  const rc1 = await rcHelper.addWindow(
      /*config=*/ null, /*options=*/ {features: 'noopener'});
  await prepareForBFCache(rc1);

  // Navigate away.
  const rc2 = await rc1.navigateToNew();

  // Navigate back.
  await rc2.historyBack();
  await assert_implements_bfcache(rc1);

  // Verify that no reasons are recorded for successful restore.
  assert_true(await rc1.executeScript(() => {
    let reasons =
        performance.getEntriesByType('navigation')[0].notRestoredReasons;
    return reasons == null;
  }));
});