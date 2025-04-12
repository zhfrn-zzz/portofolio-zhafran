#!/bin/bash

# Fungsi untuk logging
log() {
    echo "[$(date '+%Y-%m-%d %H:%M:%S')] $1"
}

# Fungsi untuk error handling
handle_error() {
    log "ERROR: $1"
    exit 1
}

# Pastikan script dijalankan sebagai root
if [ "$(id -u)" != "0" ]; then
    handle_error "Script harus dijalankan dengan sudo"
fi

# Fungsi untuk validasi IP address
validate_ip() {
    local ip=$1
    if [[ $ip =~ ^[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}$ ]]; then
        OIFS=$IFS
        IFS='.'
        ip=($ip)
        IFS=$OIFS
        [[ ${ip[0]} -le 255 && ${ip[1]} -le 255 && ${ip[2]} -le 255 && ${ip[3]} -le 255 ]]
        return $?
    else
        return 1
    fi
}

# Fungsi untuk membaca input
get_input() {
    local prompt="$1"
    local default="$2"
    local validation_func="$3"
    local input
    local valid=false
    
    while [ "$valid" = false ]; do
        exec < /dev/tty
        read -p "$prompt" input
        
        if [ -z "$input" ] && [ ! -z "$default" ]; then
            input="$default"
        fi
        
        if [ ! -z "$validation_func" ]; then
            if $validation_func "$input"; then
                valid=true
            else
                log "Input tidak valid, silakan coba lagi"
                continue
            fi
        else
            valid=true
        fi
    done
    echo "$input"
}

# Main script starts here
log "Memulai konfigurasi server..."

# Minta dan validasi input
user_ip=$(get_input "Masukkan IP address (contoh: 192.168.1.1): " "" validate_ip)
user_domain=$(get_input "Masukkan nama domain (contoh: ukom12tkj.sch.id): " "" )
mysql_root_password=$(get_input "Masukkan password untuk root MySQL: ")
phpmyadmin_password=$(get_input "Masukkan password untuk phpMyAdmin: ")
samba_username=$(get_input "Masukkan username untuk Samba (contoh: smkuser): " "")
samba_password=$(get_input "Masukkan password untuk Samba: ")

# Fix untuk dpkg yang interrupted
log "Memperbaiki package yang interrupted..."
dpkg --configure -a &> /dev/null

# Set konfigurasi otomatis untuk MySQL dan phpMyAdmin
export DEBIAN_FRONTEND=noninteractive
log "Setting up pre-configuratio.."
debconf-set-selections <<< "mysql-server mysql-server/root_password password $mysql_root_password"
debconf-set-selections <<< "mysql-server mysql-server/root_password_again password $mysql_root_password"
debconf-set-selections <<< "phpmyadmin phpmyadmin/dbconfig-install boolean true"
debconf-set-selections <<< "phpmyadmin phpmyadmin/mysql/admin-pass password $mysql_root_password"
debconf-set-selections <<< "phpmyadmin phpmyadmin/mysql/app-pass password $phpmyadmin_password"
debconf-set-selections <<< "phpmyadmin phpmyadmin/reconfigure-webserver multiselect apache2"

# Update sistem lebih cepat tanpa prompt
log "Updating package lists (fast)..."
apt-get update -qq || handle_error "Gagal melakukan update sistem"

# Install semua paket sekaligus dengan quiet flag
log "Installing packages (fast)..."
apt-get install -y -qq bind9 apache2 mysql-server apache2-utils phpmyadmin samba || handle_error "Gagal menginstall paket"

# Konfigurasi DNS resolver
log "Configuring DNS..."
cat > /etc/resolv.conf <<EOL
nameserver $user_ip
nameserver 8.8.8.8
search $user_domain
options edns0 trust-ad
EOL

# Konfigurasi zona Bind9 sesuai permintaan
reversed_ip=$(echo "$user_ip" | awk -F. '{print $3"."$2"."$1}')
log "Configuring BIND zones..."

cat > /etc/bind/named.conf.default-zones <<EOL
# Custom SMK zones
zone "$user_domain" {
     type master;
     file "/etc/bind/db.smk";
 };

zone "$reversed_ip.in-addr.arpa" {
     type master;
     file "/etc/bind/db.127";
 };

zone "0.in-addr.arpa" {
    type master;
    file "/etc/bind/db.0";
};

zone "255.in-addr.arpa" {
    type master;
    file "/etc/bind/db.255";
};
EOL

# Copy template dan edit
cp /etc/bind/db.local /etc/bind/db.smk

# Konfigurasi file zona
log "Configuring domain zone file..."
cat > /etc/bind/db.smk <<EOL
\$TTL    604800
@       IN      SOA     $user_domain. root.$user_domain. (
                        $(date +%Y%m%d)01 ; Serial
                        604800    ; Refresh
                        86400     ; Retry
                        2419200   ; Expire
                        604800 )  ; Negative Cache TTL
;
@       IN      NS      $user_domain.
@       IN      A       $user_ip
www     IN      A       $user_ip
EOL

# Konfigurasi file PTR
octet=$(echo "$user_ip" | awk -F. '{print $4}')
log "Configuring reverse lookup zone..."
cat > /etc/bind/db.127 <<EOL
@       IN      SOA     $user_domain. root.$user_domain. (
                        $(date +%Y%m%d)01 ; Serial
                        604800    ; Refresh
                        86400     ; Retry
                        2419200   ; Expire
                        604800 )  ; Negative Cache TTL
;
@       IN      NS      $user_domain.
$octet  IN      PTR     $user_domain.
EOL

# Set izin akses untuk direktori web Apache
chmod 777 /var/www/html/ -R

# Konfigurasi Samba dengan lebih cepat
log "Configuring Samba..."
useradd -m $samba_username 2>/dev/null || true
echo "$samba_password" | passwd --stdin $samba_username 2>/dev/null || echo -e "$samba_password\n$samba_password" | passwd $samba_username

# Hapus konfigurasi lama untuk [www] jika ada
sed -i '/^\[www\]/,/^$/d' /etc/samba/smb.conf

# Tambahkan konfigurasi [www] di akhir file
cat >> /etc/samba/smb.conf <<EOL

[www]
   path = /var/www/html/
   browseable = yes
   writeable = yes
   valid users = $samba_username
   admin users = $samba_username
EOL

# Set Samba password untuk user - dengan opsi noninteraktif
(echo "$samba_password"; echo "$samba_password") | smbpasswd -s -a $samba_username

# Konfigurasi phpMyAdmin
echo "Include /etc/phpmyadmin/apache.conf" >> /etc/apache2/apache2.conf

# Aktifkan modul Apache
log "Enabling Apache modules..."
a2enmod rewrite ssl > /dev/null 2>&1

# Restart layanan - parallel restart untuk kecepatan
log "Restarting services..."
systemctl restart bind9 &
systemctl restart apache2 &
systemctl restart mysql &
systemctl restart smbd &
wait

# Enable layanan pada startup
systemctl enable bind9 apache2 mysql smbd > /dev/null 2>&1

log "==== Konfigurasi Selesai ===="
log "Domain: $user_domain"
log "IP Address: $user_ip"
log "phpMyAdmin URL: http://$user_ip/phpmyadmin"
log "Samba share tersedia di: //$user_ip/www"
log "Username Samba: $samba_username"