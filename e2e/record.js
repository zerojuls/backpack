/*
 * Backpack - Skyscanner's Design System
 *
 * Copyright 2018 Skyscanner Ltd
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
const sleep = async delay => new Promise(resolve => setTimeout(resolve, delay));

module.exports = (storybookController, IOSRecorder) => async (
  kind,
  story,
  fn,
) => {
  await storybookController.activateStory(kind, story);
  const recorder = new IOSRecorder(`${kind}-${story.replace('docs:', '')}.mp4`);

  // Give the story time to load
  await sleep(2000);
  await recorder.startRecording();
  await fn();

  // Let any animation etc run
  await sleep(1500);
  await recorder.finishRecording();
};
