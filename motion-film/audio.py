# Cinematic score for the v2 film, 120 BPM, synced to scene and item cuts.
import numpy as np, wave
SR=44100; DUR=292.0; N=int(SR*DUR); rng=np.random.default_rng(3)
L=np.zeros(N,np.float32); R=np.zeros(N,np.float32)
def add(t,x,gl,gr=None):
    gr=gl if gr is None else gr; i=int(t*SR); j=min(N,i+len(x))
    if 0<=i<N and j>i: L[i:j]+=x[:j-i]*gl; R[i:j]+=x[:j-i]*gr
def mtof(m): return 440*2**((m-69)/12)
def band(n,lo,hi):
    X=np.fft.rfft(rng.standard_normal(n)); f=np.fft.rfftfreq(n,1/SR); X[(f<lo)|(f>hi)]=0; y=np.fft.irfft(X,n); return (y/(np.abs(y).max()+1e-9)).astype(np.float32)
SC=[('open',0,14),('name',14,12),('about',26,22),('experience',48,54),('platforms',102,68),('github',170,8),('featured',178,50),('rapid',228,32),('toolkit',260,12),('outro',272,20)]
def energy(t):
    for n,a,d in SC:
        if a<=t<a+d:
            if n=='open': return 0 if t<9.9 else .6
            if n in ('name','toolkit'): return .5
            if n=='about': return .6
            if n=='outro': return .45 if t<286 else 0
            if n=='github': return .4
            return 1.0
    return 0
# pads: Dm - Bb - F - C (8s each)
CH=[[50,57,62,65,69],[46,53,58,62,65],[41,48,53,57,60],[48,55,60,64,67]]
for ci in range(int(DUR/8)+1):
    t0=ci*8; ch=CH[ci%4]; n=int(11*SR); tt=np.arange(n)/SR; env=np.minimum(1,tt/2)*np.clip((11-tt)/3,0,1)
    for k,m in enumerate(ch):
        f=mtof(m); s=np.zeros(n)
        for d in (-.15,0,.13): s+=np.sin(2*np.pi*f*(1+d/100)*tt+rng.random()*6)+.3*np.sin(4*np.pi*f*tt)+.1*np.sin(6*np.pi*f*tt)
        s=(s*env*.016).astype(np.float32); p=.25+.5*k/len(ch); add(t0,s,1-p,p)
    # bass
    f=mtof(ch[0]-12); s=(np.sin(2*np.pi*f*tt)+.4*np.sin(4*np.pi*f*tt))*env*.06; add(t0,s.astype(np.float32),.5*0+1,1)
def kick():
    n=int(.4*SR); tt=np.arange(n)/SR; f=42+110*np.exp(-tt*30); return (np.sin(2*np.pi*np.cumsum(f)/SR)*np.exp(-tt*8)).astype(np.float32)
K=kick(); HH=(band(int(.06*SR),7000,15000)*np.exp(-np.arange(int(.06*SR))/SR*70)).astype(np.float32)
SN=(band(int(.25*SR),1500,8000)*np.exp(-np.arange(int(.25*SR))/SR*18)).astype(np.float32)
bt=.5; b=0; t=0.0
while t<DUR:
    e=energy(t)
    if e>0:
        if e>=.9 or b%2==0: add(t,K,.4*e)
        if e>=.9 and b%2==1: add(t,SN,.12*e,.14*e)
        add(t+bt/2,HH,.05*e,.07*e)
        ch=CH[int(t//8)%4]; m=ch[(b*2)%len(ch)]+12
        for h in (0,1):
            n=int(.35*SR); tt=np.arange(n)/SR; f=mtof(m+(12 if h else 0)); s=((np.sin(2*np.pi*f*tt)+.25*np.sin(4*np.pi*f*tt))*np.exp(-tt*10)).astype(np.float32)
            add(t+h*bt/2,s,.03*e*(1.3 if h else .7),.03*e*(.7 if h else 1.3))
    t+=bt; b+=1
def riser(d):
    n=int(d*SR); tt=np.arange(n)/SR; x=band(n,800,12000)*(tt/d)**2; f=200+1800*(tt/d)**2; x+=.3*np.sin(2*np.pi*np.cumsum(f)/SR)*(tt/d)**2; return x.astype(np.float32)
def impact():
    n=int(2.5*SR); tt=np.arange(n)/SR; f=30+60*np.exp(-tt*6); x=np.sin(2*np.pi*np.cumsum(f)/SR)*np.exp(-tt*2.2)+.35*band(n,100,4000)*np.exp(-tt*6); return x.astype(np.float32)
def whoosh(d=.7):
    n=int(d*SR); tt=np.arange(n)/SR; return (band(n,400,9000)*np.sin(np.pi*tt/d)**2).astype(np.float32)
RI=riser(3.0); IM=impact(); WH=whoosh()
for n,a,d in SC[1:]:
    add(a-3.0,RI,.10); add(a,IM,.42); add(a-.35,WH,.12,.1)
for a in (9.9,):
    add(a-2,riser(2.0),.1); add(a,IM,.35)
acc=51
for d in (14,10,8,6,6,7): add(acc,WH,.1,.12); add(acc,K,.25); acc+=d
for i in range(8): add(106+i*8-.3,WH,.1,.12); add(106+i*8,IM,.18)
for i in range(5): add(178+i*10-.3,WH,.1,.12); add(178+i*10,IM,.2)
for i in range(1,8): add(228+i*4-.25,whoosh(.5),.14,.1)
fade=np.ones(N,np.float32); fi=int(1*SR); fo=int(4*SR); fade[:fi]=np.linspace(0,1,fi); fade[-fo:]=np.linspace(1,0,fo); L*=fade; R*=fade
pk=max(np.abs(L).max(),np.abs(R).max()); g=.89/pk
st=np.empty(2*N,np.int16); st[0::2]=np.clip(L*g*32767,-32767,32767); st[1::2]=np.clip(R*g*32767,-32767,32767)
w=wave.open('score2.wav','wb'); w.setnchannels(2); w.setsampwidth(2); w.setframerate(SR); w.writeframes(st.tobytes()); w.close(); print('ok',pk)
