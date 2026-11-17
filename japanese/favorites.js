(function(root){
  class FavoriteStore{
    constructor(storage,validIds){this.storage=storage;this.valid=new Set(validIds);this.user=null;this.remote=null;this.ids=this.readGuest();this.loading=false;this.saving=false;this.loadFailed=false;this.generation=0;this.changed=()=>{};}
    readGuest(){try{const value=JSON.parse(this.storage.getItem('adecolab.guestFavorites.v1')||'[]');return new Set(Array.isArray(value)?value.filter(id=>this.valid.has(id)):[]);}catch{return new Set();}}
    async switchUser(user){
      const generation=++this.generation;this.user=user;this.ids=new Set();this.loadFailed=false;this.saving=false;this.loading=!!user;this.changed();
      if(!user){this.ids=this.readGuest();this.loading=false;this.changed();return;}
      try{const ids=await this.remote.load(user.id);if(generation===this.generation)this.ids=new Set(ids.filter(id=>this.valid.has(id)));}
      catch(error){if(generation===this.generation)this.loadFailed=true;throw error;}
      finally{if(generation===this.generation){this.loading=false;this.changed();}}
    }
    async toggle(id){
      if(!this.valid.has(id)||this.loading||this.saving||this.loadFailed)throw Error('Favorites are unavailable');
      const generation=this.generation,user=this.user,on=!this.ids.has(id);this.saving=true;this.changed();
      try{
        if(user)await this.remote.write(user.id,id,on);
        else{const next=new Set(this.ids);on?next.add(id):next.delete(id);this.storage.setItem('adecolab.guestFavorites.v1',JSON.stringify([...next]));}
        if(generation===this.generation){on?this.ids.add(id):this.ids.delete(id);}
      }finally{if(generation===this.generation){this.saving=false;this.changed();}}
    }
  }
  function remoteStore(client){return {
    async load(userId){const {data,error}=await client.from('vocabulary_favorites').select('word_id').eq('user_id',userId);if(error)throw error;return data.map(row=>row.word_id);},
    async write(userId,wordId,on){const query=on?client.from('vocabulary_favorites').insert({user_id:userId,word_id:wordId}):client.from('vocabulary_favorites').delete().eq('user_id',userId).eq('word_id',wordId);const {error}=await query;if(error&&!(on&&error.code==='23505'))throw error;}
  };}
  const api={FavoriteStore,remoteStore};if(typeof module!=='undefined')module.exports=api;else root.JapaneseFavorites=api;
})(globalThis);
