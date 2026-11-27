// install.html: the guide, step by step, for the camera picked at the top
// (fos/cameras.json: its Canon firmware, its zip, how far testers got).

import { T, applyLang, toggleLang, addStrings, currentLang } from './i18n.js';
import { latestRelease, cameraZip } from './releases.js';
import { easyCamera } from './easyinstall.js';

addStrings({
  en: {
    'ig.nav.try': 'Try it', 'ig.t': 'Put M-Film on your camera',
    'ig.d': 'Step by step, no experience needed. About 15 minutes. Nothing in the camera changes for good: take the card out and it is Canon\'s camera again.',
    'ig.which': 'Your camera',
    'ig.st.issues': 'Works on this camera with a known problem:',
    'ig.st.testing': 'Nobody has tried it on this camera yet: you could be the first. It is safe to try, and you can always go back.',
    'ig.need.t': 'What you need',
    'ig.need.1': 'Your camera, with a <b>fully charged battery</b>',
    'ig.need.2': 'An SD card (a CF card on the 5D Mark II and 50D), <b>32 GB or smaller</b> is best',
    'ig.need.3': 'A computer with a card reader (Windows or Mac)',
    'ig.need.4': 'About 15 minutes, not in the middle of a shoot',
    'ig.1.t': 'Check the camera\'s Canon firmware', 'ig.1.d': 'M-Film is made for one exact version of Canon\'s software. Turn the camera on and look:',
    'ig.1.p1': 'the last settings tab', 'ig.1.must': 'It must say',
    'ig.1.tip': 'Different? Update the camera to exactly that version first, from Canon\'s support site for your camera. A newer or older one won\'t work.',
    'ig.1m.tip': 'Canon\'s newest firmware for the M2 is 1.0.4, and M-Film needs 1.0.3: stay on 1.0.3, don\'t update to 1.0.4.',
    'ig.2.t': 'Set the camera to shoot RAW', 'ig.2.d': 'The films are made from the RAW file, so set this now, in Canon\'s menu, while it is still the normal camera:',
    'ig.2.tip': 'RAW+JPEG works too. A photo shot as JPEG only can\'t be developed.',
    'ig.3.t': 'Download the file for your camera', 'ig.3.d': 'One zip file, about 18 MB. Pay what you want for it, $0 included.', 'ig.3.btn': 'Download',
    'ig.4.t': 'Format the card in the camera', 'ig.4.d': 'Copy any photos you want to keep off the card first: formatting erases everything. Then, in the camera:',
    'ig.4.tip': 'Format it in the camera, not on the computer.',
    'ig.4m.t': 'Delete the old files, without formatting the card',
    'ig.4m.d': 'Use the card your M2 already starts Magic Lantern from. Put it in the computer and copy everything off it, to keep it. Then delete autoexec.bin and the ML folder from the card.',
    'ig.4m.tip': 'Don\'t format the card: it has to keep its boot flags.',
    'ig.4.door': 'To take the card out: camera off, open the card door, then wait for the card light to blink and go out (or 5 seconds, even if it doesn\'t blink). Taken out sooner, the camera can hang: take the battery out and put it back.',
    'ig.5.t': 'Copy the files onto the card',
    'ig.5.d': 'Put the card in the computer. Unzip the file you downloaded (Windows: right-click → Extract All; Mac: double-click it). That makes a folder: open it, select everything inside, and copy it onto the card.',
    'ig.5.ok': 'Right: on the card itself', 'ig.5.bad': 'Wrong: inside a folder',
    'ig.5.tip': 'Then eject the card (Windows: the USB icon → Eject; Mac: drag it to the bin) before you take it out.',
    'ig.5.mac': 'On a Mac: Mac\'s hidden "._" files can stop the camera. In Terminal, run dot_clean -m /Volumes/EOS_DIGITAL (your card\'s name), then eject.',
    'ig.6.t': 'Run the installer, once', 'ig.6.d': 'Camera off, card in, camera on. Then:',
    'ig.6.d2': 'Magic Lantern\'s installer appears and says when it\'s done (a few seconds). Switch the camera off.',
    'ig.6.tip': 'This doesn\'t replace Canon\'s firmware: it only tells the camera to start Magic Lantern from the card. You only do it once.',
    'ig.6u.d': 'This camera has no installer on the card: it is done from a computer, with the free program mlinstall, over USB: it is in the zip, in the folder mlinstall-for-your-computer (that folder doesn\'t go on the card). It takes two clicks: Enable Boot Disk with the camera connected, then Write card boot flags with the card in the reader.',
    'ig.6u.btn': 'The steps, with mlinstall →',
    'ig.6m.t': 'Put the card in: there\'s no installer to run',
    'ig.6m.d': 'Camera off, card in. The M2\'s zip has no installer (ML-SETUP.FIR), so for now it\'s for M2s that already start Magic Lantern from a card.',
    'ig.6m.d2': 'If your M2 has never run Magic Lantern, mlinstall may set it up as on the 1300D, but no one has tried it on an M2 yet. If you try, tell us what happened.',
    'ig.6m.btn': 'The M2\'s steps, in TESTING.md →',
    'ig.7.av': 'This camera has no trash button: a short press of Av opens M-Film\'s home.',
    'ig.7.t': 'Switch on: the film shelf appears',
    'ig.7.d': 'Turn the camera on. After a moment you\'ll see M-Film\'s shelf of films. Pick one and press SET: the roll is loaded. Now shoot.',
    'ig.7.tip': 'The delete (trash) button opens M-Film\'s home; PLAY shows the developed prints. Canon\'s own menu is in M-Film: Home → Settings (INFO on Home goes straight there) → Canon menu.',
    'ig.7.try': 'Practise on the camera in your browser first →',
    'ig.of': (n, of) => `Step ${n} of ${of}`,
    'ig.back': '← Back', 'ig.next': 'Next →',
    'ig.next.s1': 'It matches: next →', 'ig.next.s4': 'Formatted: next →', 'ig.next.s4.m2': 'Deleted: next →',
    'ig.h.t': 'If something goes wrong',
    'ig.h.1.q': '"Memory card containing firmware is required to update"',
    'ig.h.1.a': 'The camera didn\'t find the installer it accepts. Either the camera\'s firmware isn\'t exactly the version above (step 1), or the files are inside a folder instead of on the card itself (step 5). On a Mac, also run dot_clean (step 5).',
    'ig.h.1m.a': 'The M2\'s zip has no installer (ML-SETUP.FIR), so there is nothing to run from Firmware ver.: see step 6.',
    'ig.h.2.q': '"ML directory not found" / "Please copy all ML files"',
    'ig.h.2.a': 'The ML folder isn\'t next to autoexec.bin at the top of the card. Copy what is inside the unzipped folder, the ML folder included. Format in the camera first; with a card bigger than 32 GB, try a 32 GB one.',
    'ig.h.3.q': 'The camera won\'t start, or the screen stays black',
    'ig.h.3.a': 'Take the battery out, then the card. Put the battery back: the camera starts normally, as Canon\'s camera. Nothing is broken. Tell us which camera and firmware, so we can fix it.',
    'ig.h.4.q': 'Magic Lantern\'s own menu shows instead of the film shelf',
    'ig.h.4.a': 'On some cameras M-Film loads as a module after the camera starts, and it didn\'t load. The Modules tab says why on its line: tell us what it says.',
    'ig.h.5.q': 'How do I take it off?',
    'ig.h.5.a': 'Format the card in the camera. To stop the camera looking for Magic Lantern at all, run Firmware ver. → update again with the card in, and choose to remove the boot flag.',
    'ig.h.5u.a': 'Format the card in the camera. To stop the camera looking for Magic Lantern at all, connect it to mlinstall and choose Disable Boot Disk.',
    'ig.h.5m.a': 'Delete autoexec.bin and the ML folder from the card, then copy back what was on it before M-Film, which you kept in step 4. Don\'t format the card: it has to keep its boot flags, and M-Film\'s zip has no ML-SETUP.FIR to put them back, or to remove the camera\'s boot flag. No one has tried mlinstall on an M2 yet.',
    'ig.h.more': 'Still stuck? <a class="link" href="https://github.com/HNGSeries/mfilm-canon-film-simulation/issues/new/choose">Ask on GitHub</a>, with your camera and its firmware.',
  },
  th: {
    'ig.nav.try': 'ลองเล่น', 'ig.t': 'ลง M-Film ในกล้องของคุณ',
    'ig.d': 'ทำตามทีละขั้น ไม่ต้องมีความรู้มาก่อน ใช้เวลาประมาณ 15 นาที และไม่มีอะไรในกล้องเปลี่ยนถาวร ถอดการ์ดออกเมื่อไหร่ก็กลับเป็นกล้อง Canon แบบเดิม',
    'ig.which': 'กล้องของคุณ',
    'ig.st.issues': 'ใช้ได้กับรุ่นนี้ แต่มีปัญหาที่รู้แล้ว:',
    'ig.st.testing': 'ยังไม่มีใครลองกับรุ่นนี้ คุณอาจเป็นคนแรก ลองได้อย่างปลอดภัย และกลับไปแบบเดิมได้เสมอ',
    'ig.need.t': 'สิ่งที่ต้องมี',
    'ig.need.1': 'กล้องของคุณ พร้อม<b>แบตที่ชาร์จเต็ม</b>',
    'ig.need.2': 'การ์ด SD (5D Mark II และ 50D ใช้การ์ด CF) ขนาด<b>ไม่เกิน 32 GB</b> ดีที่สุด',
    'ig.need.3': 'คอมพิวเตอร์ที่มีช่องอ่านการ์ด (Windows หรือ Mac)',
    'ig.need.4': 'เวลาประมาณ 15 นาที อย่าทำระหว่างงานถ่ายจริง',
    'ig.1.t': 'เช็ก firmware ของกล้อง', 'ig.1.d': 'M-Film ทำมาสำหรับซอฟต์แวร์ของ Canon เวอร์ชันเดียวเท่านั้น เปิดกล้องแล้วดูที่:',
    'ig.1.p1': 'แท็บตั้งค่าอันสุดท้าย', 'ig.1.must': 'ต้องขึ้นว่า',
    'ig.1.tip': 'ถ้าไม่ตรง ให้อัปเดตกล้องเป็นเวอร์ชันนั้นก่อน จากเว็บ support ของ Canon สำหรับรุ่นของคุณ เวอร์ชันใหม่กว่าหรือเก่ากว่าใช้ไม่ได้',
    'ig.1m.tip': 'firmware ล่าสุดของ Canon สำหรับ M2 คือ 1.0.4 แต่ M-Film ต้องใช้ 1.0.3 ให้คงไว้ที่ 1.0.3 อย่าอัปเดตเป็น 1.0.4',
    'ig.2.t': 'ตั้งกล้องให้ถ่ายเป็น RAW', 'ig.2.d': 'ฟิล์มถูกสร้างจากไฟล์ RAW เลยต้องตั้งตอนนี้ ในเมนูของ Canon ตอนที่กล้องยังเป็นแบบปกติ:',
    'ig.2.tip': 'RAW+JPEG ก็ได้ แต่รูปที่ถ่ายเป็น JPEG อย่างเดียวล้างไม่ได้',
    'ig.3.t': 'ดาวน์โหลดไฟล์สำหรับรุ่นของคุณ', 'ig.3.d': 'zip ไฟล์เดียว ประมาณ 18 MB จ่ายเท่าไหร่ก็ได้ $0 ก็ได้', 'ig.3.btn': 'ดาวน์โหลด',
    'ig.4.t': 'ฟอร์แมตการ์ดในกล้อง', 'ig.4.d': 'ก๊อปรูปที่อยากเก็บออกจากการ์ดก่อน เพราะฟอร์แมตแล้วทุกอย่างหาย จากนั้นในกล้อง:',
    'ig.4.tip': 'ฟอร์แมตในกล้อง ไม่ใช่ในคอม',
    'ig.4m.t': 'ลบไฟล์เก่า โดยไม่ฟอร์แมตการ์ด',
    'ig.4m.d': 'ใช้การ์ดที่ M2 ของคุณเปิด Magic Lantern ได้อยู่แล้ว เสียบเข้าคอม ก๊อปทุกอย่างในการ์ดออกมาเก็บไว้ แล้วลบ autoexec.bin และโฟลเดอร์ ML ออกจากการ์ด',
    'ig.4m.tip': 'อย่าฟอร์แมตการ์ด เพราะการ์ดต้องมี boot flag อยู่',
    'ig.4.door': 'ตอนดึงการ์ดออก: ปิดกล้อง เปิดฝาช่องการ์ด แล้วรอให้ไฟการ์ดกะพริบแล้วดับก่อน (หรือรอ 5 วินาที แม้ไฟไม่กะพริบ) ถ้าดึงออกเร็วกว่านั้น กล้องอาจค้าง ให้ถอดแบตออกแล้วใส่กลับ',
    'ig.5.t': 'ก๊อปไฟล์ลงการ์ด',
    'ig.5.d': 'เสียบการ์ดเข้าคอม แตกไฟล์ zip ที่โหลดมา (Windows: คลิกขวา → Extract All, Mac: ดับเบิลคลิก) จะได้โฟลเดอร์มาหนึ่งอัน เปิดเข้าไป เลือกทุกอย่างข้างใน แล้วก๊อปลงการ์ด',
    'ig.5.ok': 'ถูก: อยู่บนการ์ดตรงๆ', 'ig.5.bad': 'ผิด: อยู่ในโฟลเดอร์',
    'ig.5.tip': 'แล้วกด Eject การ์ดก่อนดึงออก (Windows: ไอคอน USB → Eject, Mac: ลากไปถังขยะ)',
    'ig.5.mac': 'ถ้าใช้ Mac: ไฟล์ซ่อน "._" ของ Mac อาจทำให้กล้องไม่ยอมติดตั้ง เปิด Terminal แล้วพิมพ์ dot_clean -m /Volumes/EOS_DIGITAL (เปลี่ยนเป็นชื่อการ์ดของคุณ) แล้วค่อย Eject',
    'ig.6.t': 'รันตัวติดตั้ง ครั้งเดียว', 'ig.6.d': 'ปิดกล้อง ใส่การ์ด เปิดกล้อง แล้ว:',
    'ig.6.d2': 'หน้าติดตั้งของ Magic Lantern จะขึ้นมา และบอกเมื่อเสร็จ (ไม่กี่วินาที) แล้วปิดกล้อง',
    'ig.6.tip': 'ขั้นนี้ไม่ได้ลบ firmware ของ Canon แค่บอกให้กล้องเปิด Magic Lantern จากการ์ด ทำครั้งเดียวพอ',
    'ig.6u.d': 'รุ่นนี้ไม่มีตัวติดตั้งบนการ์ด ต้องติดตั้งจากคอมด้วยโปรแกรมฟรี mlinstall ผ่าน USB ซึ่งอยู่ใน zip แล้ว ในโฟลเดอร์ mlinstall-for-your-computer (โฟลเดอร์นี้ไม่ต้องก๊อปลงการ์ด) กดแค่สองครั้ง: Enable Boot Disk ตอนต่อกล้อง แล้ว Write card boot flags ตอนการ์ดอยู่ในเครื่องอ่าน',
    'ig.6u.btn': 'ขั้นตอนติดตั้งด้วย mlinstall →',
    'ig.6m.t': 'ใส่การ์ดในกล้อง ไม่มีตัวติดตั้งให้รัน',
    'ig.6m.d': 'ปิดกล้อง แล้วใส่การ์ด ใน zip ของ M2 ไม่มีตัวติดตั้ง (ML-SETUP.FIR) ตอนนี้จึงใช้ได้กับ M2 ที่เปิด Magic Lantern จากการ์ดได้อยู่แล้ว',
    'ig.6m.d2': 'ถ้า M2 ของคุณไม่เคยรัน Magic Lantern มาก่อน mlinstall อาจตั้งให้ได้เหมือนบน 1300D แต่ยังไม่มีใครลองบน M2 ลองแล้วแจ้งผลได้',
    'ig.6m.btn': 'ขั้นตอนของ M2 ใน TESTING.md →',
    'ig.7.av': 'รุ่นนี้ไม่มีปุ่มถังขยะ กดปุ่ม Av สั้นๆ เพื่อเปิดหน้า Home ของ M-Film',
    'ig.7.t': 'เปิดกล้อง: ชั้นวางฟิล์มจะขึ้นมา',
    'ig.7.d': 'เปิดกล้อง รอสักครู่จะเห็นชั้นวางฟิล์มของ M-Film เลือกม้วนแล้วกด SET ฟิล์มก็ถูกใส่แล้ว เริ่มถ่ายได้เลย',
    'ig.7.tip': 'ปุ่มลบ (ถังขยะ) เปิดหน้า Home ของ M-Film ปุ่ม PLAY ดูรูปที่ล้างแล้ว ส่วนเมนูของ Canon อยู่ใน M-Film: Home → Settings (กด INFO ที่หน้า Home ก็ไปได้ทันที) → Canon menu',
    'ig.7.try': 'ลองเล่นกับกล้องบนเว็บก่อน →',
    'ig.of': (n, of) => `ขั้นที่ ${n} จาก ${of}`,
    'ig.back': '← ย้อนกลับ', 'ig.next': 'ถัดไป →',
    'ig.next.s1': 'ตรงแล้ว ถัดไป →', 'ig.next.s4': 'ฟอร์แมตแล้ว ถัดไป →', 'ig.next.s4.m2': 'ลบแล้ว ถัดไป →',
    'ig.h.t': 'ถ้ามีปัญหา',
    'ig.h.1.q': 'ขึ้นว่า "Memory card containing firmware is required to update"',
    'ig.h.1.a': 'กล้องหาตัวติดตั้งที่ใช้ได้ไม่เจอ อาจเป็นเพราะ firmware ไม่ตรงกับเวอร์ชันข้างบน (ขั้นที่ 1) หรือไฟล์อยู่ในโฟลเดอร์แทนที่จะอยู่บนการ์ดตรงๆ (ขั้นที่ 5) ถ้าใช้ Mac ให้รัน dot_clean ด้วย (ขั้นที่ 5)',
    'ig.h.1m.a': 'ใน zip ของ M2 ไม่มีตัวติดตั้ง (ML-SETUP.FIR) จึงไม่มีอะไรให้รันจาก Firmware ver. ดูขั้นที่ 6',
    'ig.h.2.q': 'ขึ้นว่า "ML directory not found" / "Please copy all ML files"',
    'ig.h.2.a': 'โฟลเดอร์ ML ไม่ได้อยู่ข้างๆ autoexec.bin บนสุดของการ์ด ให้ก๊อปของข้างในโฟลเดอร์ที่แตกออกมา รวมถึงโฟลเดอร์ ML ด้วย ฟอร์แมตในกล้องก่อน ถ้าการ์ดใหญ่กว่า 32 GB ลองใช้การ์ด 32 GB',
    'ig.h.3.q': 'กล้องเปิดไม่ขึ้น หรือจอดำค้าง',
    'ig.h.3.a': 'ถอดแบตออก แล้วถอดการ์ด ใส่แบตกลับ กล้องจะเปิดได้ปกติแบบกล้อง Canon ไม่มีอะไรพัง บอกเราด้วยว่ากล้องรุ่นไหน firmware อะไร จะได้แก้ให้',
    'ig.h.4.q': 'ขึ้นเมนูของ Magic Lantern แทนชั้นวางฟิล์ม',
    'ig.h.4.a': 'บางรุ่น M-Film โหลดเป็นโมดูลหลังกล้องเปิด แล้วโหลดไม่สำเร็จ ดูที่แท็บ Modules บรรทัดของมันจะบอกสาเหตุ แจ้งเรามาได้เลย',
    'ig.h.5.q': 'จะเอาออกยังไง?',
    'ig.h.5.a': 'ฟอร์แมตการ์ดในกล้อง ถ้าไม่ให้กล้องหา Magic Lantern อีกเลย ให้ใส่การ์ดแล้วกด Firmware ver. → update อีกครั้ง แล้วเลือกลบ boot flag',
    'ig.h.5u.a': 'ฟอร์แมตการ์ดในกล้อง ถ้าไม่ให้กล้องหา Magic Lantern อีกเลย ให้ต่อกล้องกับ mlinstall แล้วกด Disable Boot Disk',
    'ig.h.5m.a': 'ลบ autoexec.bin และโฟลเดอร์ ML ออกจากการ์ด แล้วก๊อปของที่อยู่บนการ์ดก่อนลง M-Film ซึ่งเก็บไว้ในขั้นที่ 4 กลับลงการ์ด อย่าฟอร์แมตการ์ด เพราะการ์ดต้องมี boot flag อยู่ และใน zip ของ M-Film ไม่มี ML-SETUP.FIR ไว้ใส่คืน หรือลบ boot flag ของกล้อง ยังไม่มีใครลอง mlinstall บน M2',
    'ig.h.more': 'ยังติดอยู่? <a class="link" href="https://github.com/HNGSeries/mfilm-canon-film-simulation/issues/new/choose">ถามใน GitHub</a> บอกรุ่นกล้องและ firmware ด้วย',
  },
});

// cameras Magic Lantern has no ML-SETUP.FIR for: the boot flag is set over USB with mlinstall (TESTING.md)
const USB_INSTALL = new Set(['1300D.110']);
// the EOS M2: its zip has no ML-SETUP.FIR to put a card's boot flags back, so the card isn't formatted, the old
// files are deleted by hand, and step 5's box isn't for it (TESTING.md#canon-eos-m2)
const EOS_M2 = 'EOSM2.103';
// cameras with no trash button, where a short Av press is Home (Magic Lantern's CONFIG_MENU_WITH_AV)
const AV_HOME = new Set(['1300D.110']);
// what a camera is set up with: ML-SETUP.FIR, mlinstall over USB, or (the EOS M2) neither. install.html's
// data-setup says which of these a part of the guide is for
const setupOf = (c) => (c.platform === EOS_M2 ? 'm2' : USB_INSTALL.has(c.platform) ? 'usb' : 'fir');
let setup = 'fir';

const sel = document.getElementById('ig-camera');
let cams = [];
let camRelease = null;
latestRelease((t) => /^v\d/.test(t)).then((r) => { camRelease = r; if (cams.length) show(); });

function show() {
  const c = cams.find((x) => x.platform === sel.value) || cams[0];
  if (!c) return;
  document.getElementById('ig-fw').textContent = c.firmware;
  // the newest release's own name for it (M-Film-0.2.4-camera-...zip), once GitHub has answered
  const z = cameraZip(camRelease, c.platform);
  document.getElementById('ig-zip').textContent = z ? z.name : c.zip;
  const st = document.getElementById('ig-status');
  const status = c.status === 'nodark' ? 'working' : c.status;
  const note = (currentLang() === 'th' && c.note_th) || c.note;
  st.className = 'ig-status ' + status;
  const plain = (note || '').replace(/\[([^\]]+)\]\([^)]+\)/g, '$1').replace(/`/g, '');
  // a camera that simply works needs no line; one with a known problem, or that nobody has tried, does
  st.textContent = status === 'working' ? '' : T('ig.st.' + status) + (plain ? ' ' + plain : '');
  setup = setupOf(c);
  for (const el of document.querySelectorAll('[data-setup]')) el.hidden = !el.dataset.setup.split(' ').includes(setup);
  document.getElementById('ig-av').hidden = !AV_HOME.has(c.platform);
  easyCamera(setup === 'm2' ? null : c);
  try { localStorage.setItem('mfilm.camera', c.platform); } catch {}
}

// The guide as a form: one step at a time, with Next and Back. Each step is its own #s1 … #s7, so the
// browser's Back button goes back a step too, and a link can open a step. Without JavaScript every
// step shows, one under the other.
const list = document.querySelector('.ig-steps');
const steps = [...list.children];
const dots = document.getElementById('ig-dots');
steps.forEach((li, i) => {
  li.dataset.n = i + 1;
  const d = document.createElement('button');
  d.type = 'button';
  d.addEventListener('click', () => { location.hash = li.id; });
  dots.append(d);
});
list.classList.add('wizard');
document.getElementById('ig-progress').hidden = false;
const at = () => Math.max(0, steps.findIndex((li) => '#' + li.id === location.hash));
const still = matchMedia('(prefers-reduced-motion: reduce)');
let was = -1;

// a new step opens like a focal-plane shutter: the curtain runs down going forward, up going back
function shutter(li, forward) {
  li.classList.remove('shown'); void li.offsetWidth; li.classList.add('shown');
  if (!li.animate) return;
  if (still.matches) { li.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 160 }); return; }
  const closed = forward ? 'inset(0 0 100% 0)' : 'inset(100% 0 0 0)';
  li.animate([{ clipPath: closed }, { clipPath: 'inset(0 0 0 0)' }], { duration: 420, easing: 'cubic-bezier(0.16, 1, 0.3, 1)' });
}

function form(scroll) {
  const i = at();
  steps.forEach((li, k) => { li.hidden = k !== i; });
  if (scroll && i !== was) shutter(steps[i], i > was);
  was = i;
  [...dots.children].forEach((d, k) => {
    d.className = k <= i ? 'on' : '';
    d.setAttribute('aria-label', T('ig.of', k + 1, steps.length) + ': ' + steps[k].querySelector('h3:not([hidden])').textContent);
  });
  document.querySelector('.ig-need').hidden = i !== 0;
  document.getElementById('ig-count').textContent = T('ig.of', i + 1, steps.length);
  const next = 'ig.next.' + steps[i].id;
  const label = T([`${next}.${setup}`, next, 'ig.next'].find((k) => T(k) !== k));
  for (const b of document.querySelectorAll('[data-go="back"]')) b.hidden = i === 0;
  for (const b of document.querySelectorAll('[data-go="next"]')) { b.hidden = i === steps.length - 1; b.textContent = label; }
  // the new step's top just under the bar of Back and Next, which stays put as the page scrolls
  if (scroll) {
    const bar = document.getElementById('ig-progress');
    const under = document.querySelector('.top').offsetHeight + bar.offsetHeight;
    const y = list.getBoundingClientRect().top + scrollY - under;
    if (scrollY > y || i === 0) window.scrollTo({ top: i === 0 ? 0 : y, behavior: still.matches ? 'auto' : 'smooth' });
  }
}
for (const b of document.querySelectorAll('[data-go]')) {
  b.addEventListener('click', () => { location.hash = steps[at() + (b.dataset.go === 'next' ? 1 : -1)].id; });
}
window.addEventListener('hashchange', () => form(true));

applyLang();
form(false);
document.querySelector('.lang').addEventListener('click', () => { toggleLang(); show(); form(false); });
sel.addEventListener('change', () => { show(); form(false); });

fetch('fos/cameras.json').then((r) => r.json()).then((j) => {
  cams = j.cameras;
  let want = new URLSearchParams(location.search).get('camera');
  try { want = want || localStorage.getItem('mfilm.camera'); } catch {}
  sel.innerHTML = cams.map((c) => `<option value="${c.platform}">${c.name}</option>`).join('');
  if (cams.some((c) => c.platform === want)) sel.value = want;
  show(); form(false);
}).catch(() => {});
