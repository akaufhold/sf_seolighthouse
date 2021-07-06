<?php

declare(strict_types=1);

namespace Stackfactory\SfSeolighthouse\Domain\Model;

/**
 *
 * This file is part of the "SEO Lighthouse Score" Extension for TYPO3 CMS.
 *
 * For the full copyright and license information, please read the
 * LICENSE.txt file that was distributed with this source code.
 *
 * (c) 2021 Andreas Kauhold <info@stackfactory.de>, Stackfactory
 */

/**
 * LighthouseStatistics
 */
class LighthouseStatistics extends \TYPO3\CMS\Extbase\DomainObject\AbstractEntity
{
    /**
    * @var int
    */
    protected $crdate;
    
    /**
     * Target Page ID
     * 
     * @var int
     */
    protected $target = 0;

    /**
     * Accessibility Score
     * 
     * @var float
     */
    protected $acs = 0.0;

    /**
     * Best-Practices Score
     * 
     * @var float
     */
    protected $bps = 0.0;

    /**
     * Performance Score
     * 
     * @var float
     */
    protected $pes = 0.0;

    /**
     * PWA Score
     * 
     * @var float
     */
    protected $pwas = 0.0;

    /**
     * SEO Score
     * 
     * @var float
     */
    protected $seos = 0.0;

    /**
     * First Contentful Paint
     * 
     * @var float
     */
    protected $fcp = 0.0;

    /**
     * Speed Index
     * 
     * @var float
     */
    protected $si = 0.0;

    /**
     * Largest Contentful Paint
     * 
     * @var float
     */
    protected $lcp = 0.0;

    /**
     * Time to Interactive
     * 
     * @var float
     */
    protected $tti = 0.0;

    /**
     * Total Blocking Time
     * 
     * @var float
     */
    protected $tbt = 0.0;

    /**
     * Cumulative Layout Shift
     * 
     * @var float
     */
    protected $cls = 0.0;

    /**
     * Score First Contentful Paint
     * 
     * @var float
     */
    protected $fcps = 0.0;

    /**
     * Score Speed Index
     * 
     * @var float
     */
    protected $sis = 0.0;

    /**
     * Score Largest Contentful Paint
     * 
     * @var float
     */
    protected $lcps = 0.0;

    /**
     * Score Time to Interactive
     * 
     * @var float
     */
    protected $ttis = 0.0;

    /**
     * Score Total Blocking Time
     * 
     * @var float
     */
    protected $tbts = 0.0;

    /**
     * Score Cumulative Layout Shift 
     * 
     * @var float
     */
    protected $clss = 0.0;

    /**
     * Overall Score
     * 
     * @var float
     */
    protected $os = 0.0;

    /**
     * Device 
     * 
     * @var string
     */
    protected $device = '';

    /**
     * Returns the Creation Date
     * 
     * @return int $crdate
     */
    public function getCrdate()
    {
        return $this->crdate;
    }

    /**
     * Returns the target
     * 
     * @return int $target
     */
    public function getTarget()
    {
        return $this->target;
    }

    /**
     * Sets the target
     * 
     * @param int $target
     * @return void
     */
    public function setTarget($target)
    {
        $this->target = $target;
    }

    /**
     * Returns the acs
     * 
     * @return float $acs
     */
    public function getAcs()
    {
        return $this->acs;
    }

    /**
     * Sets the acs
     * 
     * @param float $acs
     * @return void
     */
    public function setAcs($acs)
    {
        $this->acs = $acs;
    }

    /**
     * Returns the bps
     * 
     * @return float $bps
     */
    public function getBps()
    {
        return $this->bps;
    }

    /**
     * Sets the bps
     * 
     * @param float $bps
     * @return void
     */
    public function setBps($bps)
    {
        $this->bps = $bps;
    }

    /**
     * Returns the pes
     * 
     * @return float $pes
     */
    public function getPes()
    {
        return $this->pes;
    }

    /**
     * Sets the pes
     * 
     * @param float $pes
     * @return void
     */
    public function setPes($pes)
    {
        $this->pes = $pes;
    }

    /**
     * Returns the pwas
     * 
     * @return float $pwas
     */
    public function getPwas()
    {
        return $this->pwas;
    }

    /**
     * Sets the pwas
     * 
     * @param float $pwas
     * @return void
     */
    public function setPwas($pwas)
    {
        $this->pwas = $pwas;
    }

    /**
     * Returns the seos
     * 
     * @return float $seos
     */
    public function getSeos()
    {
        return $this->seos;
    }

    /**
     * Sets the seos
     * 
     * @param float $seos
     * @return void
     */
    public function setSeos($seos)
    {
        $this->seos = $seos;
    }
    
    /**
     * Returns the fcp
     * 
     * @return float $fcp
     */
    public function getFcp()
    {
        return $this->fcp;
    }

    /**
     * Sets the fcp
     * 
     * @param float $fcp
     * @return void
     */
    public function setFcp($fcp)
    {
        $this->fcp = $fcp;
    }

    /**
     * Returns the si
     * 
     * @return float $si
     */
    public function getSi()
    {
        return $this->si;
    }

    /**
     * Sets the si
     * 
     * @param float $si
     * @return void
     */
    public function setSi($si)
    {
        $this->si = $si;
    }

    /**
     * Returns the lcp
     * 
     * @return float $lcp
     */
    public function getLcp()
    {
        return $this->lcp;
    }

    /**
     * Sets the lcp
     * 
     * @param float $lcp
     * @return void
     */
    public function setLcp($lcp)
    {
        $this->lcp = $lcp;
    }

    /**
     * Returns the tti
     * 
     * @return float $tti
     */
    public function getTti()
    {
        return $this->tti;
    }

    /**
     * Sets the tti
     * 
     * @param float $tti
     * @return void
     */
    public function setTti($tti)
    {
        $this->tti = $tti;
    }

    /**
     * Returns the tbt
     * 
     * @return float $tbt
     */
    public function getTbt()
    {
        return $this->tbt;
    }

    /**
     * Sets the tbt
     * 
     * @param float $tbt
     * @return void
     */
    public function setTbt($tbt)
    {
        $this->tbt = $tbt;
    }

    /**
     * Returns the cls
     * 
     * @return float $cls
     */
    public function getCls()
    {
        return $this->cls;
    }

    /**
     * Sets the cls
     * 
     * @param float $cls
     * @return void
     */
    public function setCls($cls)
    {
        $this->cls = $cls;
    }

    /**
     * Returns the fcps
     * 
     * @return float $fcps
     */
    public function getFcps()
    {
        return $this->fcps;
    }

    /**
     * Sets the fcps
     * 
     * @param float $fcps
     * @return void
     */
    public function setFcps($fcps)
    {
        $this->fcps = $fcps;
    }

    /**
     * Returns the sis
     * 
     * @return float $sis
     */
    public function getSis()
    {
        return $this->sis;
    }

    /**
     * Sets the sis
     * 
     * @param float $sis
     * @return void
     */
    public function setSis($sis)
    {
        $this->sis = $sis;
    }

    /**
     * Returns the lcps
     * 
     * @return float $lcps
     */
    public function getLcps()
    {
        return $this->lcps;
    }

    /**
     * Sets the lcps
     * 
     * @param float $lcps
     * @return void
     */
    public function setLcps($lcps)
    {
        $this->lcps = $lcps;
    }

    /**
     * Returns the ttis
     * 
     * @return float $ttis
     */
    public function getTtis()
    {
        return $this->ttis;
    }

    /**
     * Sets the ttis
     * 
     * @param float $ttis
     * @return void
     */
    public function setTtis($ttis)
    {
        $this->ttis = $ttis;
    }

    /**
     * Returns the tbts
     * 
     * @return float $tbts
     */
    public function getTbts()
    {
        return $this->tbts;
    }

    /**
     * Sets the tbts
     * 
     * @param float $tbts
     * @return void
     */
    public function setTbts($tbts)
    {
        $this->tbts = $tbts;
    }

    /**
     * Returns the clss
     * 
     * @return float $clss
     */
    public function getClss()
    {
        return $this->clss;
    }

    /**
     * Sets the clss
     * 
     * @param float $clss
     * @return void
     */
    public function setClss($clss)
    {
        $this->clss = $clss;
    }
    
    /**
     * Returns the device
     * 
     * @return string $device
     */
    public function getDevice()
    {
        return $this->device;
    }

    /**
     * Sets the device
     * 
     * @param string $device
     * @return void
     */
    public function setDevice($device)
    {
        $this->device = $device;
    }

}
