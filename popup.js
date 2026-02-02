document.addEventListener('DOMContentLoaded', () => {
   
    const tabWorkspaces = document.getElementById('tab-workspaces');
    const tabFocus = document.getElementById('tab-focus');
    const viewWorkspaces = document.getElementById('view-workspaces');
    const viewFocus = document.getElementById('view-focus');
    
    const inpSite = document.getElementById('site-input');
    const btnAddSite = document.getElementById('btn-add-site');
    const blockedList = document.getElementById('blocked-list');
  
 
    const inpName = document.getElementById('workspace-name');
    const btnSave = document.getElementById('btn-save');
    const list = document.getElementById('workspace-list');
  

    const inpMinutes = document.getElementById('minutes');
    const btnStart = document.getElementById('btn-start-focus');
    const btnStop = document.getElementById('btn-stop-focus');
    const timerDisplay = document.getElementById('timer');
  
  
    tabWorkspaces.addEventListener('click', () => switchTab('workspaces'));
    tabFocus.addEventListener('click', () => switchTab('focus'));
  
    function switchTab(tab) {
        if (tab === 'workspaces') {
         
          tabWorkspaces.classList.add('active');
          tabFocus.classList.remove('active');
          
        
          viewWorkspaces.classList.remove('hidden');
          viewWorkspaces.classList.add('active');
          
          viewFocus.classList.remove('active');
          viewFocus.classList.add('hidden');
          
        } else {
    
          tabFocus.classList.add('active');
          tabWorkspaces.classList.remove('active');
          
         
          viewWorkspaces.classList.remove('active');
          viewWorkspaces.classList.add('hidden');
          
          viewFocus.classList.remove('hidden');
          viewFocus.classList.add('active');
          
          updateTimerUI(); 
        }
      }
  

    loadWorkspaces();
  
    btnSave.addEventListener('click', async () => {
      const name = inpName.value.trim();
      if (!name) return alert('Please enter a workspace name!');
  
  
      const tabs = await chrome.tabs.query({ currentWindow: true });
      const urls = tabs.map(t => t.url);
  
     
      chrome.storage.local.get({ workspaces: [] }, (result) => {
        const workspaces = result.workspaces;
        workspaces.push({ id: Date.now(), name, urls });
        chrome.storage.local.set({ workspaces }, () => {
          inpName.value = '';
          loadWorkspaces();
        });
      });
    });
  
    function loadWorkspaces() {
        chrome.storage.local.get({ workspaces: [] }, (result) => {
          list.innerHTML = '';
          
          const emptyState = document.getElementById('empty-state');
          if (result.workspaces.length === 0) {
             if(emptyState) emptyState.classList.remove('hidden');
          } else {
             if(emptyState) emptyState.classList.add('hidden');
          }
  
          result.workspaces.forEach(ws => {
            const li = document.createElement('li');
            
            li.innerHTML = `
              <div class="ws-info">
                  <span class="ws-name">${ws.name}</span>
                  <span class="ws-count">${ws.urls.length} tabs</span>
              </div>
              <div class="actions">
                <button class="action-btn btn-load" data-id="${ws.id}" title="Load Workspace">
                  <svg pointer-events="none" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polygon points="5 3 19 12 5 21 5 3"></polygon></svg>
                  Load
                </button>
                
                <button class="action-btn btn-delete" data-id="${ws.id}" title="Delete Workspace">
                  <svg pointer-events="none" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"></polyline><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path></svg>
                  Delete
                </button>
              </div>
            `;
            list.appendChild(li);
          });
    
         
          document.querySelectorAll('.btn-load').forEach(b => b.addEventListener('click', (e) => loadWorkspace(e.target.dataset.id)));
          document.querySelectorAll('.btn-delete').forEach(b => b.addEventListener('click', (e) => deleteWorkspace(e.target.dataset.id)));
        });
      }
  
    function loadWorkspace(id) {
        chrome.storage.local.get({ workspaces: [] }, (result) => {
            const ws = result.workspaces.find(w => w.id == id);
            if (ws) {
               
                if(confirm(`Load "${ws.name}"? This will close current tabs.`)) {
                  
                    ws.urls.forEach(url => chrome.tabs.create({ url, active: false }));
                    
                }
            }
        });
    }
  
    function deleteWorkspace(id) {
        chrome.storage.local.get({ workspaces: [] }, (result) => {
            const newWorkspaces = result.workspaces.filter(w => w.id != id);
            chrome.storage.local.set({ workspaces: newWorkspaces }, loadWorkspaces);
        });
    }
  

   
    updateTimerUI();
    setInterval(updateTimerUI, 1000); 
  
    btnStart.addEventListener('click', () => {
        const mins = parseInt(inpMinutes.value);
        chrome.runtime.sendMessage({ cmd: 'START_FOCUS', duration: mins }, () => {
            updateTimerUI();
        });
    });
  
    btnStop.addEventListener('click', () => {
        chrome.runtime.sendMessage({ cmd: 'STOP_FOCUS' }, () => {
            updateTimerUI();
        });
    });
  
    function updateTimerUI() {
        chrome.storage.local.get(['focusActive', 'focusEndTime'], (res) => {
            if (res.focusActive && res.focusEndTime) {
                const now = Date.now();
                const diff = Math.ceil((res.focusEndTime - now) / 1000);
                
                if (diff > 0) {
                    const m = Math.floor(diff / 60);
                    const s = diff % 60;
                    timerDisplay.innerText = `${m}:${s < 10 ? '0' + s : s}`;
                    btnStart.classList.add('hidden');
                    btnStop.classList.remove('hidden');
                    inpMinutes.disabled = true;
                } else {
                    resetUI();
                }
            } else {
                resetUI();
            }
        });
    }
  
    function resetUI() {
        timerDisplay.innerText = "00:00";
        btnStart.classList.remove('hidden');
        btnStop.classList.add('hidden');
        inpMinutes.disabled = false;
    }
  
    loadBlockedSites();

    btnAddSite.addEventListener('click', () => {
        const site = inpSite.value.trim().toLowerCase();
        if (!site) return;

        chrome.storage.local.get({ blockedSites: [] }, (res) => {
            const sites = res.blockedSites;
            if (!sites.includes(site)) {
                sites.push(site);
                chrome.storage.local.set({ blockedSites: sites }, () => {
                    inpSite.value = '';
                    loadBlockedSites();
                });
            }
        });
    });

    function loadBlockedSites() {
        chrome.storage.local.get({ blockedSites: [] }, (res) => {
            blockedList.innerHTML = '';
            res.blockedSites.forEach(site => {
                const li = document.createElement('li');
                li.innerHTML = `
                    <span class="site-name">${site}</span>
                    <button class="btn-delete-site" data-site="${site}">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                    </button>
                `;
                blockedList.appendChild(li);
            });

          
            document.querySelectorAll('.btn-delete-site').forEach(b => {
                b.addEventListener('click', (e) => {
                  
                    const btn = e.target.closest('button');
                    deleteBlockedSite(btn.dataset.site);
                });
            });
        });
    }

    function deleteBlockedSite(siteToDelete) {
        chrome.storage.local.get({ blockedSites: [] }, (res) => {
            const newSites = res.blockedSites.filter(s => s !== siteToDelete);
            chrome.storage.local.set({ blockedSites: newSites }, loadBlockedSites);
        });
    }
});