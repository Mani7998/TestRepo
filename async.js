exports = async function() {
     // Supply projectID and clusterName...
    const projectID = '603ce6b799758b5d75cb40ea';
    const clusterName = 'tdevelopment-xyz';
    
     // Get stored credentials...
    const username = context.values.get("AtlasPublicKey");
    const password = context.values.get("AtlasPrivateKey");
    
     // Fetch the current cluster details...
    const currentCluster = await context.functions.execute('getCluster', username, password, projectID, clusterName);
     
    if (!currentCluster || !currentCluster.providerSettings || !currentCluster.providerSettings.instanceSizeName) {
     return "Unable to fetch current instance size.";
    }
    
    const currentInstanceSize = currentCluster.providerSettings.instanceSizeName;
    
     // Define the mapping of instance sizes and their next sizes...
     const instanceSizeMap = {
     "M20": "M30",
    "M30": "M40",
     "M40": "M50",
     "M50": "M60"
     // Add more mappings if needed
    };
    
    // Determine the next instance size based on the current size...
     const nextInstanceSize = instanceSizeMap[currentInstanceSize];
    
     if (!nextInstanceSize) {
      return "Cluster is already at the maximum instance size.";
     }
    
    // Set the desired instance size...
    const body = {
     "providerSettings" : {
    "providerName" : "AWS",
    "instanceSizeName" : nextInstanceSize
    }
   };
    
    // Scale up the cluster...
     const result = await context.functions.execute('modifyCluster', username, password, projectID, clusterName, body);
     console.log(EJSON.stringify(result));
     
     if (result.error) {
      return result;
     }
    
     return clusterName + " scaled up to " + nextInstanceSize; 
    };