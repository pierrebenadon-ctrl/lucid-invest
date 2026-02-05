export const getCurrentMonthYear = () => {
  const d = new Date();
  return `${d.getMonth() + 1}/${d.getFullYear()}`;
};

export const automationService = {
  checkAndSyncMonthlyReport: async (onProgress: (m: string) => void, force: boolean) => {
    onProgress("Connexion au Radar Alpha...");
    await new Promise(r => setTimeout(r, 1500));
    onProgress("Analyse des opportunités du mois...");
    await new Promise(r => setTimeout(r, 1500));
    return true;
  }
};
