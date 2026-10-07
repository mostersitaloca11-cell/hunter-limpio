document.addEventListener("DOMContentLoaded", () => {
    
    const tabs = document.querySelectorAll(".tab-item");
    const tabBar = document.getElementById("app-tab-bar");
    const screens = document.querySelectorAll(".screen");

    checkUserSession();

    function checkUserSession() {
        const savedName = localStorage.getItem("hunter_vecino_name");
        const savedSector = localStorage.getItem("hunter_vecino_sector");

        if (savedName && savedSector) {
            renderUserInformation(savedName, savedSector);
            showScreen("screen-schedules");
            showTabBar();
        } else {
            showScreen("screen-welcome");
            hideTabBar();
        }
    }

    function showScreen(screenId) {
        screens.forEach(screen => {
            if (screen.id === screenId) {
                screen.classList.remove("hidden");
            } else {
                screen.classList.add("hidden");
            }
        });

        tabs.forEach(tab => {
            if (tab.getAttribute("data-target") === screenId) {
                tab.classList.add("active");
            } else {
                tab.classList.remove("active");
            }
        });
    }

    function showTabBar() { 
        if (tabBar) tabBar.classList.remove("hidden"); 
    }
    function hideTabBar() { 
        if (tabBar) tabBar.classList.add("hidden"); 
    }

    const btnStart = document.getElementById("btn-welcome-start");
    if (btnStart) {
        btnStart.addEventListener("click", () => {
            showScreen("screen-register");
        });
    }

    const formRegister = document.getElementById("form-register");
    if (formRegister) {
        formRegister.addEventListener("submit", (e) => {
            e.preventDefault();

            const nameInput = document.getElementById("reg-name").value.trim();
            const phoneInput = document.getElementById("reg-phone").value.trim();
            const sectorInput = document.getElementById("reg-sector").value;

            if (nameInput && phoneInput && sectorInput) {
                localStorage.setItem("hunter_vecino_name", nameInput);
                localStorage.setItem("hunter_vecino_phone", phoneInput);
                localStorage.setItem("hunter_vecino_sector", sectorInput);

                renderUserInformation(nameInput, sectorInput);
                showScreen("screen-schedules");
                showTabBar();
            }
        });
    }

    function renderUserInformation(name, sector) {
        const displayName = document.getElementById("user-display-name");
        const displaySector = document.getElementById("user-display-sector");
        
        if (displayName) displayName.textContent = name;
        if (displaySector) displaySector.textContent = sector;

        const scheduleResultContainer = document.getElementById("schedule-result");
        if (scheduleResultContainer) {
            let scheduleHTML = "";
            switch (sector) {
                case "Hunter Centro":
                    scheduleHTML = "<p><strong>Días:</strong> Lunes, Miércoles y Viernes</p><p><strong>Horas:</strong> 7:00 a.m. a 9:00 a.m.</p>";
                    break;
                case "Bellavista":
                    scheduleHTML = "<p><strong>Días:</strong> Martes, Jueves y Sábado</p><p><strong>Horas:</strong> 6:00 a.m. a 8:00 a.m.</p>";
                    break;
                case "Pampas del Cusco":
                    scheduleHTML = "<p><strong>Días:</strong> Lunes a Sábado</p><p><strong>Horas:</strong> 8:00 p.m. a 10:00 p.m.</p>";
                    break;
                case "Chilpinilla":
                    scheduleHTML = "<p><strong>Días:</strong> Lunes, Miércoles y Viernes</p><p><strong>Horas:</strong> 2:00 p.m. a 4:00 p.m.</p>";
                    break;
                default:
                    scheduleHTML = "<p>Horario general de contingencia en actualización.</p>";
            }
            scheduleResultContainer.innerHTML = scheduleHTML;
        }
    }

    const btnLogout = document.getElementById("btn-logout");
    if (btnLogout) {
        btnLogout.addEventListener("click", () => {
            localStorage.removeItem("hunter_vecino_name");
            localStorage.removeItem("hunter_vecino_phone");
            localStorage.removeItem("hunter_vecino_sector");
            checkUserSession();
        });
    }

    // FORMULARIO DE REPORTES (ENVÍO ASÍNCRONO A GMAIL)
    const formReport = document.getElementById("form-report");
    const reportSuccessMsg = document.getElementById("report-success-msg");

    if (formReport) {
        formReport.addEventListener("submit", async (e) => {
            e.preventDefault();
            const formData = new FormData(formReport);

            try {
                const response = await fetch(formReport.action, {
                    method: formReport.method,
                    body: formData,
                    headers: { 'Accept': 'application/json' }
                });

                if (response.ok && reportSuccessMsg) {
                    reportSuccessMsg.classList.remove("hidden");
                    formReport.reset();
                    setTimeout(() => reportSuccessMsg.classList.add("hidden"), 4000);
                } else {
                    alert("Ocurrió un error al procesar el reporte. Inténtalo de nuevo.");
                }
            } catch (error) {
                alert("Error de red. Revisa tu conexión a internet.");
            }
        });
    }

    // FORMULARIO DE NUEVOS TACHOS (SUGERENCIAS VECINALES A GMAIL)
    const formNuevoTacho = document.getElementById("form-nuevo-tacho");
    const tachoSuccessMsg = document.getElementById("tacho-success-msg");

    if (formNuevoTacho) {
        formNuevoTacho.addEventListener("submit", async (e) => {
            e.preventDefault();
            const formData = new FormData(formNuevoTacho);

            try {
                const response = await fetch(formNuevoTacho.action, {
                    method: formNuevoTacho.method,
                    body: formData,
                    headers: { 'Accept': 'application/json' }
                });

                if (response.ok && tachoSuccessMsg) {
                    tachoSuccessMsg.classList.remove("hidden");
                    formNuevoTacho.reset();
                    setTimeout(() => tachoSuccessMsg.classList.add("hidden"), 4000);
                } else {
                    alert("No se pudo enviar la ubicación. Inténtalo otra vez.");
                }
            } catch (error) {
                alert("Error de conexión al enviar los datos.");
            }
        });
    }

    // CONTROL DE NAVEGACIÓN EN PESTAÑAS (EVITA FALLAS AL TOCAR EMOJIS)
    tabs.forEach(tab => {
        tab.addEventListener("click", (e) => {
            const currentTab = e.target.closest(".tab-item");
            if (currentTab) {
                const targetScreenId = currentTab.getAttribute("data-target");
                showScreen(targetScreenId);
            }
        });
    });
});
