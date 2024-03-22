async function getSubmoduleData(id) {
  try {
    const response = await fetch(`/module/dataSimple/${id}`, {
      method: 'POST',
    });
    if (!response.ok) {
      throw new Error('Failed to fetch module data');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching module data:', error);
    throw error;
  }
}

export default getSubmoduleData;
